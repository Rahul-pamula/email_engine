"""
PHASE 3: CAMPAIGN ORCHESTRATION
Ultimate Email Platform

Features:
- Campaign CRUD (Create, Read, Update, Delete)
- Snapshotting (Freezing content before send)
- Orchestration (Queueing for background worker)
- **Tenant Isolation**: JWT-based authentication
"""

from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional, List
from datetime import datetime
import uuid
import re
import random

# Import Validation Models
from models.campaign import (
    CampaignCreate, 
    CampaignUpdate, 
    CampaignResponse, 
    CampaignSnapshotCreate,
    SendRequest
)

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

# === JWT Middleware ===
from utils.jwt_middleware import require_active_tenant

# === Utilities ===
def process_spintax(text: str) -> str:
    """Process Spintax: {Hello|Hi|Hey} -> randomly picks one"""
    if not text: return ""
    pattern = r'\{([^{}]+)\}'
    def replace_spintax(match):
        options = match.group(1).split('|')
        return random.choice(options)
    while re.search(pattern, text):
        text = re.sub(pattern, replace_spintax, text)
    return text

def process_merge_tags(text: str, contact: dict) -> str:
    """Process merge tags: {{first_name}} -> actual value"""
    if not text: return ""
    pattern = r'\{\{(\w+)(?:\|([^}]+))?\}\}'
    def replace_tag(match):
        field = match.group(1)
        fallback = match.group(2) or ""
        return str(contact.get(field, fallback) or fallback)
    return re.sub(pattern, replace_tag, text)


# === Campaign Routes ===

@router.post("/", response_model=dict)
async def create_campaign(campaign: CampaignCreate, tenant_id: str = Depends(require_active_tenant)):
    """
    Create a new email campaign (Tenant Scoped).
    """
    from utils.supabase_client import db
    
    # 1. Verify Tenant Status
    tenant_result = db.client.table("tenants").select("status").eq("id", tenant_id).execute()
    if not tenant_result.data or tenant_result.data[0]["status"] != "active":
        raise HTTPException(status_code=403, detail="Tenant must be active to create campaigns.")
    
    campaign_id = str(uuid.uuid4())
    
    # 2. Insert Campaign
    data = {
        "id": campaign_id,
        "tenant_id": tenant_id,
        "project_id": tenant_id, # Simplified: Project = Tenant for now
        "name": campaign.name,
        "subject": campaign.subject,
        "body_html": campaign.body_html,
        "status": campaign.status,
        "scheduled_at": campaign.scheduled_at.isoformat() if campaign.scheduled_at else None,
        "created_at": datetime.now().isoformat()
    }
    
    db.client.table("campaigns").insert(data).execute()
    
    return {
        "status": "created",
        "id": campaign_id,
        "message": f"Campaign '{campaign.name}' created."
    }

@router.get("/")
async def list_campaigns(status: Optional[str] = None, limit: int = 50, tenant_id: str = Depends(require_active_tenant)):
    """List all campaigns for the specific Tenant"""
    from utils.supabase_client import db
    
    query = db.client.table("campaigns").select("id, name, subject, status, created_at, scheduled_at, stats:email_tasks(count)").eq("tenant_id", tenant_id)
    
    if status:
        query = query.eq("status", status)
    
    result = query.order("created_at", desc=True).limit(limit).execute()
    return {"campaigns": result.data}

@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str, tenant_id: str = Depends(require_active_tenant)):
    """Get a single campaign by ID"""
    from utils.supabase_client import db
    
    result = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return result.data[0]

@router.patch("/{campaign_id}")
async def update_campaign(campaign_id: str, campaign: CampaignUpdate, tenant_id: str = Depends(require_active_tenant)):
    """Update an existing campaign"""
    from utils.supabase_client import db
    
    update_data = {k: v for k, v in campaign.model_dump().items() if v is not None}
    if "scheduled_at" in update_data and update_data["scheduled_at"]:
        update_data["scheduled_at"] = update_data["scheduled_at"].isoformat()
    
    result = db.client.table("campaigns").update(update_data).eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return {"status": "updated", "campaign": result.data[0]}

@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: str, tenant_id: str = Depends(require_active_tenant)):
    """Delete a campaign"""
    from utils.supabase_client import db
    
    db.client.table("campaigns").delete().eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    return {"status": "deleted", "id": campaign_id}

@router.post("/{campaign_id}/send")
async def send_campaign(campaign_id: str, request: SendRequest, tenant_id: str = Depends(require_active_tenant)):
    """
    ORCHESTRATION TRIGGER:
    1. Validates campaign status (must be draft).
    2. Snapshots HTML & Subject.
    3. Updates status to 'processing'.
    4. Worker (Commander) will pick this up to generate tasks.
    """
    from utils.supabase_client import db
    
    # 1. Fetch Campaign
    campaign_res = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    if not campaign_res.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign = campaign_res.data[0]
    
    if campaign["status"] not in ["draft", "paused"]:
        raise HTTPException(status_code=400, detail=f"Campaign is in '{campaign['status']}' state. Only draft/paused campaigns can be sent.")
    
    # 2. Snapshot Content (The Freeze)
    snapshot_id = str(uuid.uuid4())
    snapshot_data = {
        "id": snapshot_id,
        "campaign_id": campaign_id,
        "body_snapshot": campaign["body_html"],
        "subject_snapshot": campaign["subject"],
        "created_at": datetime.now().isoformat()
    }
    
    db.client.table("campaign_snapshots").insert(snapshot_data).execute()
    
    # 3. Update Campaign Status -> 'processing'
    # This signals the background worker to start generating tasks
    update_payload = {
        "status": "processing",
        "scheduled_at": datetime.now().isoformat() # Mark as launched now
    }
    
    db.client.table("campaigns").update(update_payload).eq("id", campaign_id).execute()
    
    return {
        "status": "queued",
        "message": "Campaign queued for processing. Tasks are being generated in the background.",
        "snapshot_id": snapshot_id
    }

@router.post("/{campaign_id}/preview")
async def preview_campaign(campaign_id: str, sample_contact: Optional[dict] = None, tenant_id: str = Depends(require_active_tenant)):
    """Preview a campaign with sample data"""
    from utils.supabase_client import db
    
    campaign = db.client.table("campaigns").select("*").eq("id", campaign_id).eq("tenant_id", tenant_id).execute()
    if not campaign.data:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    campaign_data = campaign.data[0]
    
    contact = sample_contact or {
        "email": "preview@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    html_content = process_spintax(campaign_data["body_html"])
    html_content = process_merge_tags(html_content, contact)
    
    subject = process_spintax(campaign_data["subject"])
    subject = process_merge_tags(subject, contact)
    
    return {
        "subject": subject,
        "html": html_content
    }

