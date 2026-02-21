import sys
import os

# Add platform/api to pythonpath
sys.path.append(os.path.abspath("."))

from services.template_service import TemplateService

try:
    # Use a tenant ID and template ID that might be in the DB.
    # Let's just fetch all templates for that tenant and then try to validate them using the Pydantic model.
    tenant_id = "8e19b37d-5359-43eb-b7a5-e1c4587a1645"
    templates_res = TemplateService.list_templates(tenant_id)
    templates = templates_res.get("data", [])
    
    if templates:
        t = templates[0]
        print("Found template:", t["id"])
        
        from models.template import TemplateResponse
        # Try validating it through the Pydantic model
        try:
            validated = TemplateResponse.model_validate(t)
            print("Validation successful!")
        except Exception as ve:
            print("Pydantic Validation Error:")
            print(ve)
    else:
        print("No templates found to test.")
        
except Exception as e:
    import traceback
    traceback.print_exc()

