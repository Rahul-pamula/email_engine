import os
from supabase import create_client, Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
db = create_client(SUPABASE_URL, SUPABASE_KEY)

c = db.table("campaigns").select("name, from_name, from_prefix, domain_id, id").order("created_at", desc=True).limit(5).execute()
print("CAMPAIGNS:")
print(c.data)

d = db.table("domains").select("id, domain_name, status").execute()
print("\nDOMAINS:")
print(d.data)

