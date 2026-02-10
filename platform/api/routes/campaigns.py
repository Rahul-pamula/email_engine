"""
PHASE 2: CAMPAIGN MANAGEMENT
Ultimate Email Platform

Features:
- Campaign CRUD (Create, Read, Update, Delete)
- Spintax variable support
- Merge tag processing
- Scheduling with timezone awareness
- **Tenant Isolation**: JWT-based authentication (PRODUCTION-GRADE)
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
import re
import random

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


# === JWT Middleware (PRODUCTION-GRADE) ===
from utils.jwt_middleware import require_active_tenant, require_authenticated_user


# === DEPRECATED: Old header-based dependency ===
async def get_tenant_id(x_tenant_id: str = Header(...)):
    """ 
    DEPRECATED: Use require_active_tenant instead.
    Kept temporarily for backward compatibility.
    """
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="X-Tenant-ID header is required")
    return x_tenant_id


# === Pydantic Models (Matching Schema) ===

class CampaignCreate(BaseModel):
    """Create a new campaign"""
    name: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., min_length=1, max_length=500)
    body_html: str = Field(..., description="HTML email content with optional Spintax/variables")
    status: str = Field(default="draft")  # draft, scheduled, sending, sent, paused, cancelled
    scheduled_at: Optional[datetime] = None


class CampaignUpdate(BaseModel):
    """Update an existing campaign"""
    name: Optional[str] = None
    subject: Optional[str] = None
    body_html: Optional[str] = None
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None


class SendRequest(BaseModel):
    """Request body for sending a campaign"""
    test_emails: Optional[List[str]] = None
    contact_list_id: Optional[str] = None



# === Variable Processing (Spintax + Merge Tags) ===

def process_spintax(text: str) -> str:
    """
    Process Spintax: {Hello|Hi|Hey} -> randomly picks one
    """
    pattern = r'\{([^{}]+)\}'
    
    def replace_spintax(match):
        options = match.group(1).split('|')
        return random.choice(options)
    
    while re.search(pattern, text):
        text = re.sub(pattern, replace_spintax, text)
    
    return text


def process_merge_tags(text: str, contact: dict) -> str:
    """
    Process merge tags: {{first_name}} -> actual value
    """
    pattern = r'\{\{(\w+)(?:\|([^}]+))?\}\}'
    
    def replace_tag(match):
        field = match.group(1)
        fallback = match.group(2) or ""
        return str(contact.get(field, fallback) or fallback)
    
    return re.sub(pattern, replace_tag, text)


# === Campaign Routes ===

@router.post("/")
async def create_campaign(campaign: CampaignCreate, tenant_id: str = Depends(require_active_tenant)):
    """
    Create a new email campaign (Tenant Scoped).
    
    SECURITY GUARD: Only ACTIVE tenants can create campaigns.
    Onboarding tenants must complete onboarding first.
    """
    from utils.supabase_client import db
    
    # CRITICAL: Check tenant status before allowing campaign creation
    tenant_result = db.client.table("tenants").select("status").eq("id", tenant_id).execute()
    
    if not tenant_result.data:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    tenant_status = tenant_result.data[0]["status"]
    
    if tenant_status != "active":
        raise HTTPException(
            status_code=403,
            detail=f"Tenant is in '{tenant_status}' status. Complete onboarding to create campaigns."
        )
    
    campaign_id = str(uuid.uuid4())
    
    # Match schema exactly: id, name, subject, body_html, status, scheduled_at, created_at, tenant_id
    data = {
        "id": campaign_id,
        "tenant_id": tenant_id,
        "name": campaign.name,
        "subject": campaign.subject,
        "body_html": campaign.body_html,
        "status": campaign.status,
        "scheduled_at": campaign.scheduled_at.isoformat() if campaign.scheduled_at else None,
        "created_at": datetime.now().isoformat()
    }
    
    result = db.client.table("campaigns").insert(data).execute()
    
    return {
        "status": "created",
        "id": campaign_id,
        "tenant_id": tenant_id,
        "message": f"Campaign '{campaign.name}' created successfully."
    }


@router.get("/")
async def list_campaigns(status: Optional[str] = None, limit: int = 50, tenant_id: str = Depends(require_active_tenant)):
    """List all campaigns for the specific Tenant"""
    from utils.supabase_client import db
    
    # Enforce Tenant Isolation
    query = db.client.table("campaigns").select("id, name, subject, status, created_at, scheduled_at").eq("tenant_id", tenant_id)
    
    if status:
        query = query.eq("status", status)
    
    result = query.order("created_at", desc=True).limit(limit).execute()
    
    return {"campaigns": result.data}


@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str, tenant_id: str = Depends(require_active_tenant)):
    """Get a single campaign by ID (Tenant Scoped)"""
    from utils.supabase_client import db
    
    # Enforce Tenant Isolation
    result = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result.data[0]


@router.patch("/{campaign_id}")
async def update_campaign(campaign_id: str, campaign: CampaignUpdate, tenant_id: str = Depends(require_active_tenant)):
    """Update an existing campaign (Tenant Scoped)"""
    from utils.supabase_client import db
    
    # Only include non-None fields
    update_data = {k: v for k, v in campaign.model_dump().items() if v is not None}
    
    # Convert datetime to ISO string
    if "scheduled_at" in update_data and update_data["scheduled_at"]:
        update_data["scheduled_at"] = update_data["scheduled_at"].isoformat()
    
    # Enforce Tenant Isolation
    result = db.client.table("campaigns").update(update_data).eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return {"status": "updated", "campaign": result.data[0]}


@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: str, tenant_id: str = Depends(require_active_tenant)):
    """Delete a campaign (Tenant Scoped)"""
    from utils.supabase_client import db
    
    # Enforce Tenant Isolation
    result = db.client.table("campaigns").delete().eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    return {"status": "deleted", "id": campaign_id}


@router.post("/{campaign_id}/send")
async def send_campaign(campaign_id: str, request: SendRequest, tenant_id: str = Depends(require_active_tenant)):
    """
    Send a campaign to contacts.
    
    SECURITY GUARD: Only ACTIVE tenants can send campaigns.
    Tenant Scoped: Only sends if campaign belongs to tenant.
    """
    from utils.supabase_client import db
    
    # CRITICAL: Check tenant status before allowing email sending
    tenant_result = db.client.table("tenants").select("status").eq("id", tenant_id).execute()
    
    if not tenant_result.data:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    tenant_status = tenant_result.data[0]["status"]
    
    if tenant_status != "active":
        raise HTTPException(
            status_code=403,
            detail=f"Tenant is in '{tenant_status}' status. Complete onboarding to send campaigns."
        )
    
    # Get campaign with Tenant Check
    campaign = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    if not campaign.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign_data = campaign.data[0]
    
    # Get recipients (Tenant Check: Assume contact_list_id is project_id/tenant_id)
    # Ideally, we should also verify contact_list_id belongs to tenant_id, but here `project_id` IS `tenant_id`
    target_project_id = request.contact_list_id or tenant_id
    
    # Verify access to project
    if target_project_id != tenant_id:
        # Strict Mode: You can only send to your own lists
        target_project_id = tenant_id

    if request.test_emails:
        recipients = [{"email": e} for e in request.test_emails]
    elif request.contact_list_id:
        # Use target_project_id
        contacts = db.client.table("contacts").select("email").eq("project_id", target_project_id).execute()
        recipients = contacts.data if contacts.data else []
    else:
        raise HTTPException(status_code=400, detail="Either test_emails or contact_list_id required")
    
    # Create email tasks
    tasks_created = 0
    for contact in recipients:
        email = contact["email"]
        domain = email.split('@')[-1] if '@' in email else 'unknown'
        isp = 'gmail' if 'gmail' in domain else 'outlook' if 'outlook' in domain or 'hotmail' in domain else 'yahoo' if 'yahoo' in domain else 'other'
        
        # Process content
        html_content = process_spintax(campaign_data["body_html"])
        html_content = process_merge_tags(html_content, contact)
        
        subject = process_spintax(campaign_data["subject"])
        subject = process_merge_tags(subject, contact)
        
        task = {
            "trace_id": str(uuid.uuid4()),
            "tenant_id": tenant_id,  # CRITICAL: Associate task with tenant
            "campaign_id": campaign_id,
            "recipient_email": email,
            "recipient_domain": domain,
            "recipient_isp": isp,
            "status": "pending",
            "payload_rendered": f"<html><body>{html_content}</body></html>"
        }
        
        db.client.table("email_tasks").insert(task).execute()
        tasks_created += 1
    
    # Update campaign status
    db.client.table("campaigns").update({"status": "sending"}).eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    return {
        "status": "sending",
        "tasks_created": tasks_created,
        "tenant_id": tenant_id,
        "message": f"Created {tasks_created} email tasks. Worker will process them."
    }


@router.post("/{campaign_id}/preview")
async def preview_campaign(campaign_id: str, sample_contact: Optional[dict] = None, tenant_id: str = Depends(require_active_tenant)):
    """Preview a campaign (Tenant Scoped)"""
    from utils.supabase_client import db
    
    campaign = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    if not campaign.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign_data = campaign.data[0]
    
    # Sample contact for preview
    contact = sample_contact or {
        "email": "preview@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    # Process content
    html_content = process_spintax(campaign_data["body_html"])
    html_content = process_merge_tags(html_content, contact)
    
    subject = process_spintax(campaign_data["subject"])
    subject = process_merge_tags(subject, contact)
    
    return {
        "subject": subject,
        "html": html_content
    }

