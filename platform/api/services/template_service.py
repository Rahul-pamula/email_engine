from typing import List, Optional, Dict, Any
from uuid import UUID
from utils.supabase_client import db
from models.template import TemplateCreate, TemplateUpdate

class TemplateService:
    
    DEFAULT_MJML = """<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="20px" color="#626262" font-family="Helvetica, Arial, sans-serif">
          Start designing your email...
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>"""

    @staticmethod
    def create_template(tenant_id: str, template: TemplateCreate) -> Dict[str, Any]:
        """Create a new template (Stabilization Mode: No MJML compilation)"""
        
        # Ensure strict MJML source
        mjml_source = template.mjml_source
        if not mjml_source or not isinstance(mjml_source, str) or not mjml_source.strip():
            mjml_source = TemplateService.DEFAULT_MJML

        # Stabilization: compiled_html is stored raw if provided, else empty
        compiled_html = template.compiled_html or ""

        result = db.client.table("templates").insert({
            "tenant_id": tenant_id,
            "name": template.name,
            "subject": template.subject,
            "category": template.category,
            "mjml_json": template.mjml_json,
            "mjml_source": mjml_source,
            "compiled_html": compiled_html, # No sanitization in stabilization
            "version": 1
        }).execute()
        
        return result.data[0] if result.data else None

    @staticmethod
    def get_template(tenant_id: str, template_id: str) -> Optional[Dict[str, Any]]:
        """Get a template by ID"""
        result = db.client.table("templates")\
            .select("*")\
            .eq("tenant_id", tenant_id)\
            .eq("id", template_id)\
            .execute()
            
        if not result.data:
            return None
            
        template = result.data[0]
        
        # Patch broken data on read
        if not template.get("mjml_source") or not isinstance(template["mjml_source"], str):
             template["mjml_source"] = TemplateService.DEFAULT_MJML
             
        return template

    @staticmethod
    def list_templates(tenant_id: str, page: int = 1, limit: int = 20) -> Dict[str, Any]:
        """List templates with pagination"""
        offset = (page - 1) * limit
        
        result = db.client.table("templates")\
            .select("*", count="exact")\
            .eq("tenant_id", tenant_id)\
            .order("updated_at", desc=True)\
            .range(offset, offset + limit - 1)\
            .execute()
            
        return {
            "data": result.data,
            "total": result.count,
            "page": page,
            "limit": limit
        }

    @staticmethod
    def update_template(tenant_id: str, template_id: str, template: TemplateUpdate) -> Optional[Dict[str, Any]]:
        """Update a template (Stabilization Mode: No versioning)"""
        existing = TemplateService.get_template(tenant_id, template_id)
        if not existing:
            return None
            
        update_data = {}
        if template.name is not None:
            update_data["name"] = template.name
        if template.subject is not None:
            update_data["subject"] = template.subject
        if template.category is not None:
            update_data["category"] = template.category
        if template.mjml_json is not None:
            update_data["mjml_json"] = template.mjml_json
        if template.mjml_source is not None:
            update_data["mjml_source"] = template.mjml_source
        if template.compiled_html is not None:
            update_data["compiled_html"] = template.compiled_html # No sanitization
            
        if not update_data:
            return existing
            
        # Stabilization: Do NOT increment version
        # update_data["version"] = existing["version"] + 1
        
        result = db.client.table("templates")\
            .update(update_data)\
            .eq("tenant_id", tenant_id)\
            .eq("id", template_id)\
            .execute()
            
        return result.data[0] if result.data else None

    @staticmethod
    def delete_template(tenant_id: str, template_id: str) -> bool:
        """Delete a template"""
        result = db.client.table("templates")\
            .delete()\
            .eq("tenant_id", tenant_id)\
            .eq("id", template_id)\
            .execute()
            
        return len(result.data) > 0
