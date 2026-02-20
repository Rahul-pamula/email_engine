"""
AUTHENTICATION ROUTES
Progressive Tenant Onboarding System

Features:
- User signup with email/password
- User login with JWT token generation
- Automatic tenant creation on signup
- Password hashing with bcrypt
- JWT-based authentication
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


# === Pydantic Models ===

class SignupRequest(BaseModel):
    """User signup request"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=200)


class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    """Authentication response"""
    user_id: str
    tenant_id: str
    token: str
    onboarding_required: bool
    tenant_status: str


# === Helper Functions ===

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


# === Routes ===

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """
    Create a new user account and tenant.
    
    Flow:
    1. Validate email uniqueness
    2. Hash password
    3. Create user record
    4. Create tenant record (status: 'onboarding')
    5. Link user to tenant as owner
    6. Generate JWT token
    7. Return token + tenant info
    """
    from utils.supabase_client import db
    
    # Check if email already exists
    existing_user = db.client.table("users").select("id").eq("email", request.email).execute()
    
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate IDs
    user_id = str(uuid.uuid4())
    tenant_id = str(uuid.uuid4())
    
    # Hash password
    password_hash = hash_password(request.password)
    
    try:
        # 1. Create user
        user_data = {
            "id": user_id,
            "email": request.email,
            "password_hash": password_hash,
            "full_name": request.full_name,
            "email_verified": False,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        db.client.table("users").insert(user_data).execute()
        
        # 2. Create tenant (status: onboarding)
        tenant_data = {
            "id": tenant_id,
            "email": request.email,  # Required by existing schema
            "status": "onboarding",
            "created_at": datetime.utcnow().isoformat()
        }
        
        db.client.table("tenants").insert(tenant_data).execute()
        
        # 3. Link user to tenant as owner
        tenant_user_data = {
            "tenant_id": tenant_id,
            "user_id": user_id,
            "role": "owner",
            "joined_at": datetime.utcnow().isoformat()
        }
        
        db.client.table("tenant_users").insert(tenant_user_data).execute()
        
        # 4. Create onboarding progress tracker
        onboarding_data = {
            "tenant_id": tenant_id,
            "stage_basic_info": False,
            "stage_compliance": False,
            "stage_intent": False,
            "started_at": datetime.utcnow().isoformat()
        }
        
        db.client.table("onboarding_progress").insert(onboarding_data).execute()
        
        # 5. Generate JWT token
        token_data = {
            "user_id": user_id,
            "tenant_id": tenant_id,
            "email": request.email,
            "role": "owner"
        }
        
        access_token = create_access_token(token_data)
        
        # 6. Update last login
        db.client.table("users").update({
            "last_login_at": datetime.utcnow().isoformat()
        }).eq("id", user_id).execute()
        
        # 7. Send email verification link
        from services.email_service import send_email_verification
        import secrets
        
        verify_token = secrets.token_hex(64)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
        
        db.client.table("email_verification_tokens").insert({
            "user_id": user_id,
            "token": verify_token,
            "expires_at": expires_at.isoformat(),
        }).execute()
        
        # Fire and forget sending email
        await send_email_verification(request.email, verify_token)
        
        return AuthResponse(
            user_id=user_id,
            tenant_id=tenant_id,
            token=access_token,
            onboarding_required=True,
            tenant_status="onboarding"
        )
        
    except Exception as e:
        # Rollback: Delete created records if any step fails
        # Note: In production, use database transactions
        try:
            db.client.table("tenant_users").delete().eq("user_id", user_id).execute()
            db.client.table("tenants").delete().eq("id", tenant_id).execute()
            db.client.table("users").delete().eq("id", user_id).execute()
        except:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Authenticate an existing user.
    
    Flow:
    1. Verify email exists
    2. Verify password
    3. Get user's primary tenant
    4. Generate JWT token
    5. Return token + tenant info
    
    MULTI-TENANT HANDLING:
    - Currently returns user's FIRST tenant (by join date)
    - Future: Add /auth/switch-tenant endpoint
    - Future: Add tenant picker UI for users with multiple tenants
    - For now: Most users have one tenant (owner of their org)
    """
    from utils.supabase_client import db
    
    # Get user by email
    user_result = db.client.table("users").select("*").eq("email", request.email).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = user_result.data[0]
    
    # Verify password
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Get user's primary tenant (first tenant they're a member of)
    # TODO: When implementing multi-tenant support, add tenant selection logic
    tenant_user_result = db.client.table("tenant_users").select(
        "tenant_id, role"
    ).eq("user_id", user["id"]).order("joined_at").limit(1).execute()
    
    if not tenant_user_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No tenant found for user"
        )
    
    tenant_user = tenant_user_result.data[0]
    tenant_id = tenant_user["tenant_id"]
    role = tenant_user["role"]
    
    # Get tenant status
    tenant_result = db.client.table("tenants").select("status").eq("id", tenant_id).execute()
    
    if not tenant_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Tenant not found"
        )
    
    tenant_status = tenant_result.data[0]["status"]
    
    # Generate JWT token
    token_data = {
        "user_id": user["id"],
        "tenant_id": tenant_id,
        "email": user["email"],
        "role": role
    }
    
    access_token = create_access_token(token_data)
    
    # Update last login
    db.client.table("users").update({
        "last_login_at": datetime.utcnow().isoformat()
    }).eq("id", user["id"]).execute()
    
    return AuthResponse(
        user_id=user["id"],
        tenant_id=tenant_id,
        token=access_token,
        onboarding_required=(tenant_status == "onboarding"),
        tenant_status=tenant_status
    )


@router.get("/me")
async def get_current_user():
    """
    Get current authenticated user info.
    
    TODO: Implement JWT verification middleware
    For now, this is a placeholder.
    """
    return {
        "message": "JWT verification not yet implemented",
        "note": "Use the token from signup/login in Authorization header"
    }
