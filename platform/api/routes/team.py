from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import secrets
from datetime import datetime, timedelta, timezone

from utils.jwt_middleware import require_active_tenant, require_authenticated_user, JWTPayload, verify_jwt_token
from utils.supabase_client import db
from services.email_service import send_team_invite

router = APIRouter(prefix="/team", tags=["Team & Workspaces"])


class InviteRequest(BaseModel):
    email: EmailStr
    role: str = "member"
    isolation_model: str = "team"

class AcceptInviteRequest(BaseModel):
    token: str

class UpdateRoleRequest(BaseModel):
    role: Optional[str] = None
    isolation_model: Optional[str] = None


# Helper to check if current user is owner/admin
def _require_admin_role(jwt_payload: JWTPayload) -> bool:
    if jwt_payload.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="You must be an admin to perform this action.")
    return True


@router.get("/members")
async def get_team_members(tenant_id: str = Depends(require_active_tenant)):
    """List all users in the current workspace."""
    # Since Supabase rest doesn't easily do clean many-to-many joins without RPC, we'll fetch both and map
    tu_res = db.client.table("tenant_users").select("user_id, role, isolation_model, joined_at").eq("tenant_id", tenant_id).execute()
    members = tu_res.data or []
    if not members:
        return []

    user_ids = [m["user_id"] for m in members]
    users_res = db.client.table("users").select("id, email, full_name, avatar_url, last_login_at").in_("id", user_ids).execute()
    users_by_id = {u["id"]: u for u in (users_res.data or [])}

    result = []
    for m in members:
        u = users_by_id.get(m["user_id"], {})
        result.append({
            "user_id": m["user_id"],
            "role": m["role"],
            "isolation_model": m.get("isolation_model", "team"),
            "joined_at": m["joined_at"],
            "email": u.get("email"),
            "full_name": u.get("full_name"),
            "avatar_url": u.get("avatar_url"),
            "last_login_at": u.get("last_login_at"),
        })
    return result


@router.get("/invites/validate")
async def validate_invite(token: str):
    """Peek at an invite token to get the target email (no auth required, doesn't consume the token)."""
    res = db.client.table("team_invitations").select("email, role, isolation_model, expires_at, tenant_id").eq("token", token).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")
    
    invite = res.data[0]
    
    # Check expiration
    if datetime.fromisoformat(invite["expires_at"].replace('Z', '+00:00')) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invitation has expired.")
    
    # Get workspace name
    t_res = db.client.table("tenants").select("company_name").eq("id", invite["tenant_id"]).execute()
    workspace_name = t_res.data[0].get("company_name") or "the team" if t_res.data else "the team"
    
    return {
        "invited_email": invite["email"],
        "role": invite["role"],
        "workspace_name": workspace_name
    }


@router.get("/invites")
async def get_pending_invites(
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """List pending invitations for the workspace (filtered by role)."""
    if jwt_payload.role in ["owner", "admin"]:
        # Owners and Admins see all invites for the tenant
        res = db.client.table("team_invitations").select("*").eq("tenant_id", tenant_id).execute()
    else:
        # Standard members only see invites they personally sent
        res = db.client.table("team_invitations").select("*").eq("tenant_id", tenant_id).eq("inviter_id", jwt_payload.user_id).execute()
        
    return res.data or []


@router.post("/invites")
async def send_invite(
    body: InviteRequest, 
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Invite a new member to the workspace."""
    _require_admin_role(jwt_payload)
    
    if body.role not in ["owner", "admin", "member"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be owner, admin, or member.")

    # Check if they already exist in the workspace
    # First get user id by email
    user_res = db.client.table("users").select("id").eq("email", body.email).execute()
    if user_res.data:
        existing_uid = user_res.data[0]["id"]
        tu_res = db.client.table("tenant_users").select("id").eq("tenant_id", tenant_id).eq("user_id", existing_uid).execute()
        if tu_res.data:
            raise HTTPException(status_code=400, detail="User is already a member of this workspace.")

    # Generate token
    token = secrets.token_urlsafe(32)
    expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    # Insert invite
    db.client.table("team_invitations").insert({
        "tenant_id": tenant_id,
        "email": body.email,
        "role": body.role,
        "isolation_model": body.isolation_model,
        "token": token,
        "expires_at": expires_at,
        "inviter_id": jwt_payload.user_id
    }).execute()

    # Get Workspace / Inviter info for email
    t_res = db.client.table("tenants").select("company_name").eq("id", tenant_id).execute()
    workspace_name = t_res.data[0].get("company_name") or "Your Team"
    
    inviter_res = db.client.table("users").select("full_name").eq("id", jwt_payload.user_id).execute()
    inviter_name = inviter_res.data[0].get("full_name") or jwt_payload.email

    # Fire background email
    await send_team_invite(body.email, inviter_name, workspace_name, token)

    return {"message": f"Invitation sent to {body.email}"}


@router.delete("/invites/{invite_id}")
async def cancel_invite(
    invite_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Cancel a pending invitation."""
    # Fetch the invite to check permissions
    res = db.client.table("team_invitations").select("id, inviter_id").eq("id", invite_id).eq("tenant_id", tenant_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Invitation not found.")
        
    invite = res.data[0]
    
    # Must be admin/owner, OR be the person who sent the invite
    if jwt_payload.role not in ["owner", "admin"] and jwt_payload.user_id != invite.get("inviter_id"):
        raise HTTPException(status_code=403, detail="You do not have permission to cancel this invitation.")
        
    db.client.table("team_invitations").delete().eq("id", invite_id).execute()
    return {"message": "Invitation canceled successfully."}


@router.post("/invites/accept")
async def accept_invite(
    body: AcceptInviteRequest,
    jwt_payload: JWTPayload = Depends(require_authenticated_user)
):
    """Accept an invitation to join a workspace."""
    # Verify token
    res = db.client.table("team_invitations").select("*").eq("token", body.token).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")
    
    invite = res.data[0]
    
    # Check expiration
    if datetime.fromisoformat(invite["expires_at"].replace('Z', '+00:00')) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invitation has expired.")

    # Add to tenant_users
    try:
        db.client.table("tenant_users").insert({
            "tenant_id": invite["tenant_id"],
            "user_id": jwt_payload.user_id,
            "role": invite["role"],
            "isolation_model": invite.get("isolation_model", "team"),
            "joined_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    except Exception as e:
        if "duplicate key value" in str(e).lower():
            pass # Already a member
        else:
            raise HTTPException(status_code=500, detail="Failed to add user to workspace.")

    # Delete the invite
    db.client.table("team_invitations").delete().eq("id", invite["id"]).execute()

    # Issue a FRESH JWT with the new tenant_id so the frontend session stays correct
    from routes.auth import create_access_token
    new_token = create_access_token({
        "user_id": jwt_payload.user_id,
        "tenant_id": invite["tenant_id"],
        "email": jwt_payload.email,
        "role": invite["role"],
        "isolation_model": invite.get("isolation_model", "team")
    })

    return {
        "message": "Successfully joined workspace.",
        "tenant_id": invite["tenant_id"],
        "new_token": new_token,
        "role": invite["role"],
        "isolation_model": invite.get("isolation_model", "team")
    }


@router.delete("/members/{user_id}")
async def remove_member(
    user_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Remove a user from the workspace."""
    _require_admin_role(jwt_payload)
    
    # Prevent self-removal here (could build a separate 'leave' route)
    if user_id == jwt_payload.user_id:
        raise HTTPException(status_code=400, detail="You cannot remove yourself.")

    # Optional: Prevent removing the last owner
    
    db.client.table("tenant_users").delete().eq("tenant_id", tenant_id).eq("user_id", user_id).execute()
    return {"message": "Member removed."}


@router.delete("/members/me/leave")
async def leave_workspace(
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Allow a user to voluntarily leave the workspace."""
    user_id = jwt_payload.user_id
    
    # Check if they are the last owner
    if jwt_payload.role == "owner":
        owners_res = db.client.table("tenant_users").select("id").eq("tenant_id", tenant_id).eq("role", "owner").execute()
        if owners_res.data and len(owners_res.data) <= 1:
            raise HTTPException(status_code=400, detail="You are the last owner of this workspace. Transfer ownership or delete the workspace instead.")
            
    # Delete their membership
    db.client.table("tenant_users").delete().eq("tenant_id", tenant_id).eq("user_id", user_id).execute()
    
    return {"message": "You have left the workspace."}


@router.patch("/members/{user_id}/role")
async def update_member_role(
    user_id: str,
    body: UpdateRoleRequest,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Change a user's role and access mode in the workspace."""
    # Only owners can change roles 
    if jwt_payload.role != "owner":
        raise HTTPException(status_code=403, detail="Only owners can change roles.")
        
    if body.role and body.role not in ["owner", "admin", "member"]:
        raise HTTPException(status_code=400, detail="Invalid role.")
        
    if body.isolation_model and body.isolation_model not in ["team", "agency"]:
        raise HTTPException(status_code=400, detail="Invalid isolation model.")
        
    if user_id == jwt_payload.user_id and body.role:
        raise HTTPException(status_code=400, detail="You cannot modify your own role.")

    updates = {}
    if body.role:
        updates["role"] = body.role
    if body.isolation_model:
        updates["isolation_model"] = body.isolation_model
        
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update.")

    res = db.client.table("tenant_users").update(updates).eq("tenant_id", tenant_id).eq("user_id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    return {"message": "Member details updated."}


# === Enterprise JIT Auto-Discovery Routes ===

@router.get("/requests")
async def get_join_requests(
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """List pending Enterprise JIT access requests."""
    _require_admin_role(jwt_payload)
    
    res = db.client.table("join_requests").select("*").eq("tenant_id", tenant_id).eq("status", "pending").execute()
    requests = res.data or []
    if not requests:
        return []

    user_ids = [r["user_id"] for r in requests]
    users_res = db.client.table("users").select("id, email, full_name, avatar_url").in_("id", user_ids).execute()
    users_by_id = {u["id"]: u for u in (users_res.data or [])}

    result = []
    for r in requests:
        u = users_by_id.get(r["user_id"], {})
        result.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "status": r["status"],
            "risk_score": r["risk_score"],
            "created_at": r["created_at"],
            "email": u.get("email"),
            "full_name": u.get("full_name"),
            "avatar_url": u.get("avatar_url"),
        })
    return result


@router.post("/requests/{request_id}/approve")
async def approve_join_request(
    request_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Approve a join request and promote the user to workspace member."""
    _require_admin_role(jwt_payload)
    
    # Verify request
    req_res = db.client.table("join_requests").select("*").eq("id", request_id).eq("tenant_id", tenant_id).execute()
    if not req_res.data:
        raise HTTPException(status_code=404, detail="Request not found or unauthorized.")
        
    join_req = req_res.data[0]
    if join_req["status"] != "pending":
        raise HTTPException(status_code=400, detail="Request is already processed.")
        
    # Mark as approved
    db.client.table("join_requests").update({
        "status": "approved", 
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", request_id).execute()
    
    # Insert into tenant_users
    try:
        db.client.table("tenant_users").insert({
            "tenant_id": tenant_id,
            "user_id": join_req["user_id"],
            "role": "member",
            "joined_at": datetime.now(timezone.utc).isoformat()
        }).execute()
    except Exception:
        pass # Handle cases where they might already exist
        
    return {"message": "Request approved and user added to workspace."}


@router.post("/requests/{request_id}/deny")
async def deny_join_request(
    request_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Deny a join request."""
    _require_admin_role(jwt_payload)
    
    req_res = db.client.table("join_requests").select("id").eq("id", request_id).eq("tenant_id", tenant_id).execute()
    if not req_res.data:
        raise HTTPException(status_code=404, detail="Request not found.")
        
    db.client.table("join_requests").update({
        "status": "denied", 
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", request_id).execute()
    
    return {"message": "Request denied."}


@router.post("/requests/{request_id}/blacklist")
async def blacklist_join_request(
    request_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Permanently block a user from joining."""
    _require_admin_role(jwt_payload)
    
    req_res = db.client.table("join_requests").select("id").eq("id", request_id).eq("tenant_id", tenant_id).execute()
    if not req_res.data:
        raise HTTPException(status_code=404, detail="Request not found.")
        
    db.client.table("join_requests").update({
        "status": "blocked", 
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", request_id).execute()
    
    return {"message": "User blacklisted from workspace."}
