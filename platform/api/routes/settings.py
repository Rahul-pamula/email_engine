"""
Settings Routes — Phase 8A
Handles profile, organization, and API key management.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid
import hashlib
import secrets
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["Settings"])

from utils.supabase_client import db
from utils.jwt_middleware import verify_jwt_token, JWTPayload


# ── Pydantic Models ────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    timezone: Optional[str] = None

class IsolationModelUpdate(BaseModel):
    data_isolation_model: str


class OrganizationUpdate(BaseModel):
    company_name: Optional[str] = None
    business_address: Optional[str] = None
    business_city: Optional[str] = None
    business_state: Optional[str] = None
    business_zip: Optional[str] = None
    business_country: Optional[str] = None


class ApiKeyCreate(BaseModel):
    name: str


# ── Profile ────────────────────────────────────────────────────────────

@router.get("/profile")
async def get_profile(claims: JWTPayload = Depends(verify_jwt_token)):
    """Return current user's profile info"""
    result = db.client.table("users").select(
        "id, email, full_name, timezone, created_at"
    ).eq("id", claims.user_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")

    return result.data[0]


@router.patch("/profile")
async def update_profile(body: ProfileUpdate, claims: JWTPayload = Depends(verify_jwt_token)):
    """Update current user's name or timezone"""
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    result = db.client.table("users").update(updates).eq("id", claims.user_id).execute()
    return {"message": "Profile updated", "data": result.data[0] if result.data else {}}


# ── Organization ───────────────────────────────────────────────────────

@router.get("/organization")
async def get_organization(claims: JWTPayload = Depends(verify_jwt_token)):
    """Return current tenant's organization info"""
    result = db.client.table("tenants").select(
        "id, email, company_name, business_address, business_city, "
        "business_state, business_zip, business_country, created_at"
    ).eq("id", claims.tenant_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Organization not found")

    return result.data[0]


@router.patch("/organization")
async def update_organization(body: OrganizationUpdate, claims: JWTPayload = Depends(verify_jwt_token)):
    """Update current tenant's organization details"""
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update")

    result = db.client.table("tenants").update(updates).eq("id", claims.tenant_id).execute()
    return {"message": "Organization updated", "data": result.data[0] if result.data else {}}


@router.patch("/organization/isolation-model")
async def update_isolation_model(
    body: IsolationModelUpdate, 
    from_utils_jwt = Depends(verify_jwt_token)
):
    """
    Update the workspace data isolation model.
    Only owners can do this.
    Returns a fresh JWT token so the owner's session isn't invalidated by the middleware.
    """
    if from_utils_jwt.role != "owner":
        raise HTTPException(code=403, detail="Only the workspace owner can change the isolation model.")
        
    if body.data_isolation_model not in ["team", "agency"]:
        raise HTTPException(status_code=400, detail="Invalid isolation model. Must be 'team' or 'agency'.")

    db.client.table("tenants").update({
        "data_isolation_model": body.data_isolation_model
    }).eq("id", from_utils_jwt.tenant_id).execute()
    
    # Generate fresh JWT
    from routes.auth import create_access_token
    token_data = {
        "user_id": from_utils_jwt.user_id,
        "tenant_id": from_utils_jwt.tenant_id,
        "email": from_utils_jwt.email,
        "role": from_utils_jwt.role,
        "isolation_model": body.data_isolation_model
    }
    
    access_token = create_access_token(token_data)
    
    return {
        "message": f"Workspace updated to {body.data_isolation_model} model.",
        "token": access_token
    }


# ── API Keys ───────────────────────────────────────────────────────────

@router.get("/api-keys")
async def list_api_keys(claims: JWTPayload = Depends(verify_jwt_token)):
    """List all active API keys for the tenant (never return the raw secret)"""
    result = db.client.table("api_keys").select(
        "id, name, key_prefix, created_at, last_used_at"
    ).eq("tenant_id", claims.tenant_id).is_("revoked_at", "null").order("created_at", desc=True).execute()

    return {"api_keys": result.data or []}


@router.post("/api-keys")
async def create_api_key(body: ApiKeyCreate, claims: JWTPayload = Depends(verify_jwt_token)):
    """Generate a new API key. The raw key is shown ONCE — never stored in plain text."""
    raw_key = f"ee_{secrets.token_urlsafe(32)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:12]

    result = db.client.table("api_keys").insert({
        "id": str(uuid.uuid4()),
        "tenant_id": claims.tenant_id,
        "name": body.name,
        "key_hash": key_hash,
        "key_prefix": key_prefix,
        "created_at": datetime.utcnow().isoformat(),
    }).execute()

    return {
        "message": "API key created. Copy it now — it will not be shown again.",
        "key": raw_key,
        "key_prefix": key_prefix,
        "name": body.name,
    }


@router.delete("/api-keys/{key_id}")
async def revoke_api_key(key_id: str, claims: JWTPayload = Depends(verify_jwt_token)):
    """Revoke (soft-delete) an API key by setting revoked_at"""
    result = db.client.table("api_keys").update({
        "revoked_at": datetime.utcnow().isoformat()
    }).eq("id", key_id).eq("tenant_id", claims.tenant_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="API key not found")

    return {"message": "API key revoked"}


# ── GDPR Compliance ────────────────────────────────────────────────────

@router.post("/gdpr/erase-contact/{contact_id}")
async def gdpr_erase_contact(contact_id: str, claims: JWTPayload = Depends(verify_jwt_token)):
    """
    GDPR Right to Erasure — anonymize a contact.
    Does NOT delete the row (preserves analytics history).
    Overwrites PII with anonymized placeholders.
    """
    # Verify contact belongs to this tenant
    check = db.client.table("contacts").select("id").eq("id", contact_id).eq("tenant_id", claims.tenant_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Contact not found")

    db.client.table("contacts").update({
        "email": f"deleted_{contact_id[:8]}@gdpr.invalid",
        "first_name": "[Deleted]",
        "last_name": "[Deleted]",
        "phone": None,
        "custom_fields": {},
        "status": "unsubscribed",
    }).eq("id", contact_id).execute()

    return {"message": f"Contact {contact_id} anonymized per GDPR Right to Erasure"}
