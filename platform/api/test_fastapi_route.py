import asyncio
import os
import sys

# Add platform/api to pythonpath
sys.path.append(os.path.abspath("."))

from fastapi.testclient import TestClient
from main import app
from utils.supabase_client import db

# We need to bypass require_active_tenant dependency
from utils.jwt_middleware import require_active_tenant

tenant_id = "8e19b37d-5359-43eb-b7a5-e1c4587a1645"
def override_tenant():
    return tenant_id

app.dependency_overrides[require_active_tenant] = override_tenant

client = TestClient(app)

res = client.get("/templates/6b772af4-5c4c-47d3-b733-5c2937082a97")
print("STATUS CODE:", res.status_code)
if res.status_code != 200:
    print("ERROR BODY:", res.json())
else:
    print("KEYS:", res.json().keys())

