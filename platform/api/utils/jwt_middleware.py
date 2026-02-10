"""
JWT MIDDLEWARE & VALIDATION
Tenant Isolation Security Layer

Features:
- Extract and validate JWT from Authorization header
- Verify tenant_id from JWT (authoritative)
- Prevent header spoofing (X-Tenant-ID must match JWT)
- Dependency injection for protected routes
"""

from fastapi import Header, HTTPException, status, Depends
from jose import JWTError, jwt
from typing import Optional
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"


class JWTPayload:
    """Validated JWT payload"""
    def __init__(self, user_id: str, tenant_id: str, email: str, role: str):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.email = email
        self.role = role


def verify_jwt_token(authorization: str = Header(..., alias="Authorization")) -> JWTPayload:
    """
    Verify JWT token from Authorization header.
    
    Returns validated payload with user_id, tenant_id, email, role.
    Raises HTTPException if token is invalid or missing.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    
    try:
        # Decode and verify JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Extract required fields
        user_id = payload.get("user_id")
        tenant_id = payload.get("tenant_id")
        email = payload.get("email")
        role = payload.get("role")
        
        if not all([user_id, tenant_id, email, role]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing required fields"
            )
        
        return JWTPayload(
            user_id=user_id,
            tenant_id=tenant_id,
            email=email,
            role=role
        )
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_tenant_id_with_validation(
    jwt_payload: JWTPayload = Depends(verify_jwt_token),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID")
) -> str:
    """
    Get tenant_id from JWT (authoritative source).
    
    CRITICAL SECURITY:
    - tenant_id comes from JWT (cannot be spoofed)
    - If X-Tenant-ID header is present, it MUST match JWT
    - This prevents header spoofing and debug confusion
    
    Phase 1 (current): Accept both JWT and header, validate match
    Phase 2 (future): Warn if header is used
    Phase 3 (future): Reject header entirely
    """
    tenant_id = jwt_payload.tenant_id
    
    # SECURITY: If header is present, it MUST match JWT
    if x_tenant_id and x_tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tenant ID mismatch: header={x_tenant_id}, JWT={tenant_id}. JWT is authoritative."
        )
    
    return tenant_id


def require_active_tenant(
    jwt_payload: JWTPayload = Depends(verify_jwt_token),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID")
) -> str:
    """
    PRODUCTION-GRADE DEPENDENCY: Require active tenant with JWT verification.
    
    This is the PRIMARY dependency for all protected routes.
    
    Security guarantees:
    1. JWT must be present and valid
    2. tenant_id comes from JWT (authoritative)
    3. Header must match JWT if present (prevents spoofing)
    4. Tenant must be in 'active' status
    5. Returns tenant_id for use in route
    
    Use this on:
    - /campaigns/*
    - /contacts/*
    - /analytics/*
    - Any route that requires completed onboarding
    """
    from utils.supabase_client import db
    
    # Get tenant_id from JWT (authoritative)
    tenant_id = jwt_payload.tenant_id
    
    # SECURITY: Validate header matches JWT if present
    if x_tenant_id and x_tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tenant ID mismatch: header={x_tenant_id}, JWT={tenant_id}. JWT is authoritative."
        )
    
    # Check tenant exists and get status
    tenant_result = db.client.table("tenants").select("status").eq("id", tenant_id).execute()
    
    if not tenant_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    tenant_status = tenant_result.data[0]["status"]
    
    # CRITICAL: Only active tenants can access protected features
    if tenant_status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Tenant is in '{tenant_status}' status. Complete onboarding to access this feature."
        )
    
    return tenant_id


def require_authenticated_user(
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
) -> JWTPayload:
    """
    Require authenticated user (any tenant status).
    
    Use this for:
    - /onboarding/* routes (need auth but not active status)
    - /auth/me
    - Profile routes
    """
    return jwt_payload
