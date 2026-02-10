
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

def add_column_if_missing(table, column, type_def):
    print(f"Checking {table}.{column}...")
    try:
        # Try to select the column to see if it exists
        supabase.table(table).select(column).limit(1).execute()
        print(f"✅ {table}.{column} exists.")
    except Exception as e:
        print(f"⚠️ {table}.{column} missing. Attempting to add via SQL RPC (if available) or reporting need for manual migration.")
        print(f"Error detail: {e}")
        
        # Since we don't have direct SQL access here, we try to use a "run_sql" function if it exists,
        # or we just log it. In Supabase-Py, we can't alter table easily without SQL editor.
        # But we can try to use the `rpc` interface if a helper exists, or just warn the user.
        
        print(f"❌ AUTOMATIC MIGRATION FAILED: You must add `{column}` ({type_def}) to `{table}` in the Supabase Dashboard SQL Editor.")

print("--- Checking Tenant Schema ---")
add_column_if_missing("campaigns", "tenant_id", "text")
add_column_if_missing("email_tasks", "tenant_id", "text")
# tracking_events is optional for now as per plan
