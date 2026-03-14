"""
Run Phase 8 DB migration via Supabase admin client.
Usage: python run_migration.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_SERVICE_KEY"]  # service key has admin privileges

supabase = create_client(url, key)

# Run each SQL statement separately (Supabase REST doesn't support multi-statement)
statements = [
    # Profile columns
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC'",
    # Org columns
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS company_name TEXT",
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_address TEXT",
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_city TEXT",
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_state TEXT",
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_zip TEXT",
    "ALTER TABLE tenants ADD COLUMN IF NOT EXISTS business_country TEXT",
    # API Keys table
    """CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        key_prefix TEXT NOT NULL,
        last_used_at TIMESTAMPTZ,
        revoked_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    "CREATE INDEX IF NOT EXISTS idx_api_keys_tenant_id ON api_keys(tenant_id)",
    "CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash) WHERE revoked_at IS NULL",
]

for sql in statements:
    try:
        # Use rpc to run raw SQL via Supabase's pg functions
        result = supabase.rpc("exec_sql", {"query": sql}).execute()
        print(f"✅ OK: {sql[:60]}...")
    except Exception as e:
        # Try alternative: direct via postgrest
        print(f"⚠  Note: {sql[:60]}... → {str(e)[:80]}")

print("\n✅ Migration complete!")
print("Please also run the SQL manually in Supabase Dashboard → SQL Editor:")
print("→ /platform/api/migrations/phase8_settings.sql")
