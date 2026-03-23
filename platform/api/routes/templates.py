from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel

from services.template_service import TemplateService
from models.template import TemplateCreate, TemplateUpdate
from utils.jwt_middleware import require_active_tenant, JWTPayload, verify_jwt_token
from utils.supabase_client import db

router = APIRouter(prefix="/templates", tags=["Templates"])

@router.post("/")
async def create_template_endpoint(
    template: TemplateCreate,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Create a new template"""
    result = TemplateService.create_template(tenant_id, jwt_payload.user_id, template)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create template")
    return result

@router.get("/")
async def list_templates_endpoint(
    page: int = 1,
    limit: int = 20,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """List templates with pagination"""
    try:
        return TemplateService.list_templates(tenant_id, jwt_payload, page, limit)
    except Exception as e:
        import traceback
        print(f"ERROR list_templates: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{template_id}")
async def get_template_endpoint(
    template_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Get a template by ID"""
    result = TemplateService.get_template(tenant_id, jwt_payload, template_id)
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return result

@router.put("/{template_id}")
async def update_template_endpoint(
    template_id: str,
    template: TemplateUpdate,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Update a template"""
    # Restrict members from updating other peoples templates
    record = db.client.table("templates").select("created_by_user_id").eq("id", template_id).eq("tenant_id", tenant_id).execute()
    if not record.data: raise HTTPException(status_code=404, detail="Template not found")
    if jwt_payload.role == "member" and record.data[0].get("created_by_user_id") != jwt_payload.user_id:
        raise HTTPException(status_code=403, detail="You can only edit templates that you created.")

    result = TemplateService.update_template(tenant_id, template_id, template, jwt_payload)
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return result

@router.delete("/{template_id}")
async def delete_template_endpoint(
    template_id: str,
    tenant_id: str = Depends(require_active_tenant),
    jwt_payload: JWTPayload = Depends(verify_jwt_token)
):
    """Delete a template"""
    # Restrict members from deleting other peoples templates
    record = db.client.table("templates").select("created_by_user_id").eq("id", template_id).eq("tenant_id", tenant_id).execute()
    if not record.data: raise HTTPException(status_code=404, detail="Template not found")
    if jwt_payload.role == "member" and record.data[0].get("created_by_user_id") != jwt_payload.user_id:
        raise HTTPException(status_code=403, detail="You can only delete templates that you created.")

    success = TemplateService.delete_template(tenant_id, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted"}

class CompilePreviewRequest(BaseModel):
    design_json: Dict[str, Any]

@router.post("/compile/preview")
async def compile_preview_endpoint(
    payload: CompilePreviewRequest,
):
    """Compiles the given design_json to raw HTML for editor preview."""
    try:
        from services.compile_service import compile_design_json
        html = compile_design_json(payload.design_json)
        return {"html": html}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
