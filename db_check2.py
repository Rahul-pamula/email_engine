import os
from dotenv import load_dotenv
load_dotenv("/Users/pamula/Desktop/Sh_R_Mail/.env")

from supabase import create_client
db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])

cid = "fdaf14b2-9d67-40de-a78d-539596bfbf8a"  # rahul_testing
d = db.table("campaign_dispatch").select("*").eq("campaign_id", cid).execute()
print(f"Status: {d.data[0]['status']}")
print(f"Payload from_email: {d.data[0].get('from_email', 'MISSING')}")
print(d.data[0])
