"""
Sender Identity API Routes
Phase 10 — Anti-Spoofing Verification

Enforces domain/prefix ownership by requiring users to input a 6-digit OTP
sent to the email address they are trying to add to their workspace.
"""

import math
import secrets
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from utils.jwt_middleware import require_active_tenant, verify_jwt_token, JWTPayload
from utils.supabase_client import db
from services.email_service import send_email

router = APIRouter(prefix="/senders", tags=["Sender Identities"])

# ─── Pydantic Models ─────────────────────────────────────────────

class VerifyRequest(BaseModel):
    email: EmailStr

class VerifySubmit(BaseModel):
    email: EmailStr
    otp_code: str

# ─── Routes ──────────────────────────────────────────────────────

@router.get("/")
async def list_verified_senders(
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Returns a list of all verified sender identities for the current user."""
    res = db.client.table("verified_senders") \
        .select("id, email, is_verified, created_at") \
        .eq("tenant_id", tenant_id) \
        .eq("user_id", jwt_payload.user_id) \
        .order("created_at", desc=True) \
        .execute()
    
    return {"data": res.data}


@router.post("/verify-request")
async def request_sender_verification(
    body: VerifyRequest, 
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """
    Step 1: Generates a 6-digit OTP and emails it to the requested address to prove ownership.
    """
    email = body.email.strip().lower()

    # Generate a cryptographically secure 6-digit OTP
    otp = str(secrets.randbelow(1_000_000)).zfill(6)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    # Upsert the record for this tenant and user (so they can request a new OTP if it expired)
    # Since we have a UNIQUE constraint on (tenant_id, user_id, email), we must handle conflicts
    existing_res = db.client.table("verified_senders").select("*") \
        .eq("tenant_id", tenant_id) \
        .eq("user_id", jwt_payload.user_id) \
        .eq("email", email).execute()

    if existing_res.data:
        record = existing_res.data[0]
        if record.get("is_verified"):
            raise HTTPException(status_code=400, detail="This email is already verified for your workspace.")
        
        # Update the existing pending record with a new OTP
        db.client.table("verified_senders").update({
            "otp_code": otp,
            "expires_at": expires_at.isoformat()
        }).eq("id", record["id"]).execute()
    else:
        # Insert a fresh pending record
        db.client.table("verified_senders").insert({
            "tenant_id": tenant_id,
            "user_id": jwt_payload.user_id,
            "email": email,
            "is_verified": False,
            "otp_code": otp,
            "expires_at": expires_at.isoformat()
        }).execute()

    # Dispatch the email immediately
    html_body = f"""
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Verify your Sender Identity</h2>
        <p>You requested to add <b>{email}</b> as a sender identity in your ShRMail workspace.</p>
        <p>Please enter the following 6-digit verification code to prove ownership of this inbox:</p>
        <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 24px 0;">
            {otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in 15 minutes.</p>
    </div>
    """
    
    success = await send_email(
        to_email=email,
        subject="Your ShRMail Verification Code",
        html_body=html_body,
        text_body=f"Your verification code is: {otp}. It expires in 15 minutes."
    )

    if not success:
        raise HTTPException(status_code=500, detail="Failed to send the verification email. Please check your SMTP settings.")

    return {"message": f"Verification code sent to {email}"}


@router.post("/verify-submit")
async def submit_sender_verification(
    body: VerifySubmit, 
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """
    Step 2: Validates the 6-digit OTP. If correct, marks the sender identity as verified forever.
    """
    email = body.email.strip().lower()
    otp_code = body.otp_code.strip()

    res = db.client.table("verified_senders").select("*") \
        .eq("tenant_id", tenant_id) \
        .eq("user_id", jwt_payload.user_id) \
        .eq("email", email).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="No pending verification found for this email.")

    record = res.data[0]

    if record.get("is_verified"):
        raise HTTPException(status_code=400, detail="This email is already verified.")

    # Check expiration
    expires_at = datetime.fromisoformat(record["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The verification code has expired. Please request a new one.")

    # Constant time string comparison is safer, but standard equality is okay for 6 digits here
    if record.get("otp_code") != otp_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code.")

    # Mark as verified!
    db.client.table("verified_senders").update({
        "is_verified": True,
        "otp_code": None, # Clear the OTP for security
        "expires_at": None
    }).eq("id", record["id"]).execute()

    return {"message": f"Successfully verified {email}!"}


@router.delete("/{sender_id}")
async def delete_sender(
    sender_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Delete a verified sender identity belonging to this user."""
    res = db.client.table("verified_senders").delete() \
        .eq("id", sender_id) \
        .eq("tenant_id", tenant_id) \
        .eq("user_id", jwt_payload.user_id) \
        .execute()
    return {"message": "Sender identity removed."}
