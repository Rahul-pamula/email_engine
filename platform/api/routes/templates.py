from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from uuid import UUID

from services.template_service import TemplateService
from models.template import TemplateCreate, TemplateUpdate, TemplateResponse
from utils.jwt_middleware import require_active_tenant

router = APIRouter(prefix="/templates", tags=["Templates"])

@router.post("/", response_model=TemplateResponse)
async def create_template_endpoint(
    template: TemplateCreate,
    tenant_id: str = Depends(require_active_tenant)
):
    """Create a new template"""
    result = TemplateService.create_template(tenant_id, template)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create template")
    return result

@router.get("/", response_model=dict)
async def list_templates_endpoint(
    page: int = 1,
    limit: int = 20,
    tenant_id: str = Depends(require_active_tenant)
):
    """List templates with pagination"""
    try:
        return TemplateService.list_templates(tenant_id, page, limit)
    except Exception as e:
        import traceback
        print(f"ERROR list_templates: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template_endpoint(
    template_id: str,
    tenant_id: str = Depends(require_active_tenant)
):
    """Get a template by ID"""
    result = TemplateService.get_template(tenant_id, template_id)
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    print(f"DEBUG: get_template {template_id} -> mjml_source len: {len(result.get('mjml_source') or '')}")
    return result

@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template_endpoint(
    template_id: str,
    template: TemplateUpdate,
    tenant_id: str = Depends(require_active_tenant)
):
    """Update a template"""
    result = TemplateService.update_template(tenant_id, template_id, template)
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return result

@router.delete("/{template_id}")
async def delete_template_endpoint(
    template_id: str,
    tenant_id: str = Depends(require_active_tenant)
):
    """Delete a template"""
    success = TemplateService.delete_template(tenant_id, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted"}
