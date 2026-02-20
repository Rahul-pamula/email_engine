from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import uuid
from typing import Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Structured logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Import route modules
from fastapi.staticfiles import StaticFiles
from routes import campaigns, webhooks, auth, onboarding, contacts, templates, assets

app = FastAPI(
    title="Email Engine API",
    description="Ultimate Email Marketing Platform",
    version="1.0.0"
)

# Mount static files directory for assets
# The directory "assets" will be served at /static/assets
os.makedirs("assets", exist_ok=True)
app.mount("/static/assets", StaticFiles(directory="assets"), name="assets")

# CRITICAL: Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers AFTER middleware
app.include_router(webhooks.router)
app.include_router(campaigns.router)
app.include_router(auth.router)
app.include_router(onboarding.router)
app.include_router(contacts.router)
app.include_router(templates.router)
app.include_router(assets.router)


class ContactCreate(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    custom_fields: Optional[dict] = {}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

from utils.supabase_client import db

@app.post("/fields")
async def create_field(name: str, field_type: str, project_id: str = "default-project"):
    return db.create_custom_field(project_id, name, field_type)

@app.get("/fields")
async def get_fields(project_id: str = "default-project"):
    return db.get_custom_fields(project_id)

@app.post("/contacts/upload")
async def upload_contacts(file: UploadFile = File(...), project_id: str = "default-project"):
    """
    Project 1: Data & Contact Management
    Elite Normalization Engine
    - Multi-tenant isolated (via project_id)
    - Bulk persistent storage in Supabase
    """
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format")

    contents = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        # 1. Normalization
        df.columns = [c.strip().lower().replace(' ', '_') for c in df.columns]

        if 'email' not in df.columns:
            raise HTTPException(status_code=400, detail="Missing required column: 'email'")

        df = df[df['email'].str.contains('@', na=False)]
        records = df.to_dict(orient='records')

        # 2. Persist to DB
        db.bulk_insert_contacts(project_id, records)

        return {
            "status": "success",
            "count": len(df),
            "message": f"Successfully ingested {len(df)} contacts."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.post("/test-send")
async def test_send(recipient_email: str, subject: str = "Test Email", body: str = "<h1>Hello!</h1>"):
    """
    Project 3: Test-Send Bypass
    Quickly insert a task for immediate processing by the worker.
    """
    trace_id = str(uuid.uuid4())
    
    # Extract domain and ISP
    domain = recipient_email.split('@')[-1] if '@' in recipient_email else 'unknown'
    isp = 'gmail' if 'gmail' in domain else 'outlook' if 'outlook' in domain or 'hotmail' in domain else 'yahoo' if 'yahoo' in domain else 'other'
    
    task = {
        "trace_id": trace_id,
        "recipient_email": recipient_email,
        "recipient_domain": domain,
        "recipient_isp": isp,
        "status": "pending",
        "payload_rendered": f"<html><body><h1>{subject}</h1>{body}<p>Trace: {trace_id}</p></body></html>"
    }
    
    result = db.client.table("email_tasks").insert(task).execute()
    
    return {
        "status": "queued",
        "trace_id": trace_id,
        "message": "Task created. Worker will pick it up shortly."
    }
