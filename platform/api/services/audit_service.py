"""
AUDIT LOG SERVICE
Phase 1.5 — Auth Security

Provides a single write_log() function that any route can call.
PRIVACY RULE: Never log PII (email bodies, CSV content, passwords).
Only log metadata: who did what, when, on which record.
"""

from datetime import datetime, timezone
from typing import Optional
import uuid


async def write_log(
    tenant_id: str,
    action: str,
    *,
    user_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    metadata: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> None:
    """
    Write an audit log entry.

    Usage:
        await write_log(
            tenant_id=tenant_id,
            user_id=user_id,
            action="contact.delete",
            resource_type="contact",
            resource_id=contact_id,
            metadata={"count": 1}  # non-PII only
        )

    Actions to use:
        auth.login         auth.logout       auth.signup
        auth.password_reset_request         auth.password_reset_complete
        contact.import     contact.delete    contact.restore
        campaign.create    campaign.send     campaign.pause    campaign.cancel
        template.create    template.delete
        tenant.plan_change tenant.upgrade
    """
    from utils.supabase_client import db

    try:
        log_entry = {
            "id": str(uuid.uuid4()),
            "tenant_id": tenant_id,
            "action": action,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if user_id:
            log_entry["user_id"] = user_id
        if resource_type:
            log_entry["resource_type"] = resource_type
        if resource_id:
            log_entry["resource_id"] = resource_id
        if metadata:
            log_entry["metadata"] = metadata
        if ip_address:
            log_entry["ip_address"] = ip_address
        if user_agent:
            log_entry["user_agent"] = user_agent

        db.client.table("audit_logs").insert(log_entry).execute()

    except Exception as e:
        # Never let audit log failures crash the main request
        print(f"[AUDIT LOG ERROR] Failed to write log: {e}")
