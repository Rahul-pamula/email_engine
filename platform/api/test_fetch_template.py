import sys
import os

# Add platform/api to pythonpath
sys.path.append(os.path.abspath("."))

from services.template_service import TemplateService

tenant_id = "8e19b37d-5359-43eb-b7a5-e1c4587a1645" # the one from previous logs
template_id = "6b772af4-5c4c-47d3-b733-5c2937082a97"

try:
    print("Fetching template...")
    template = TemplateService.get_template(tenant_id, template_id)
    print("Found template keys:", template.keys() if template else "None")
except Exception as e:
    import traceback
    traceback.print_exc()

