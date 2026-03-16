import os
import httpx
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseManager:
    def __init__(self):
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")

        # Force HTTP/1.1 to avoid httpx HTTP/2 stale-connection drops.
        # Supabase closes idle HTTP/2 streams, causing RemoteProtocolError:
        # ConnectionTerminated. HTTP/1.1 uses simple request/response — no issue.
        http1_transport = httpx.HTTPTransport(http2=False)
        http1_client = httpx.Client(transport=http1_transport, timeout=30.0)

        self.client: Client = create_client(url, key)
        # Swap the underlying httpx session on the postgrest client to HTTP/1.1
        self.client.postgrest.session = http1_client


    def bulk_insert_contacts(self, project_id: str, contacts: list):
        """
        Efficiently insert contacts into Supabase.
        Uses the 'contacts' table from Phase 1 Schema.
        Custom fields are stored separately in contact_field_values.
        """
        # Prepare data for insertion (only core fields)
        data = [
            {
                "project_id": project_id,
                "email": c.get("email")
            }
            for c in contacts
        ]
        
        # Batch size for Supabase (typically recommends 1000 per request)
        batch_size = 1000
        results = []
        for i in range(0, len(data), batch_size):
            batch = data[i:i + batch_size]
            response = self.client.table("contacts").upsert(batch, on_conflict="project_id,email").execute()
            results.append(response)
        
        return results

    def create_custom_field(self, project_id: str, name: str, field_type: str, options: dict = None):
        """
        Register a new custom field for a project.
        """
        return self.client.table("contact_fields").insert({
            "project_id": project_id,
            "name": name,
            "field_type": field_type,
            "options": options
        }).execute()

    def get_custom_fields(self, project_id: str):
        return self.client.table("contact_fields").select("*").eq("project_id", project_id).execute()

# Singleton instance
db = SupabaseManager()
