import os
import psycopg2
from urllib.parse import urlparse

# Load DATABASE_URL manually or assume it's set in env if not creating a parser
# Since we are in a script, let's just grab it from the .env file content we read earlier or hardcode for this one-off
# DATABASE_URL from previous view_file: 
# postgresql://postgres.iiweorjzoxcfaedsubxu:email_engine123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

DB_URL = "postgresql://postgres.iiweorjzoxcfaedsubxu:email_engine123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

def run_migration():
    print("🚀 Connecting to database...")
    try:
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = True
        cur = conn.cursor()
        
        print("📜 Reading migration file...")
        with open("migrations/004_add_mjml_source.sql", "r") as f:
            sql = f.read()
            
        print("▶️ Executing SQL...")
        cur.execute(sql)
        
        print("✅ Migration successful!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    run_migration()
