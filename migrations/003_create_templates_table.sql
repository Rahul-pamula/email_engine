-- Migration: Create Templates Table
-- Description: Stores MJML templates and their compiled HTML for the email engine.

CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT DEFAULT 'marketing',
    mjml_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    compiled_html TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for tenant-scoped lookups
CREATE INDEX IF NOT EXISTS idx_templates_tenant ON templates(tenant_id);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Tenants can only see their own templates
CREATE POLICY "Tenants can view their own templates"
    ON templates
    FOR SELECT
    USING (tenant_id = (current_setting('app.current_tenant_id')::UUID));

CREATE POLICY "Tenants can insert their own templates"
    ON templates
    FOR INSERT
    WITH CHECK (tenant_id = (current_setting('app.current_tenant_id')::UUID));

CREATE POLICY "Tenants can update their own templates"
    ON templates
    FOR UPDATE
    USING (tenant_id = (current_setting('app.current_tenant_id')::UUID));

CREATE POLICY "Tenants can delete their own templates"
    ON templates
    FOR DELETE
    USING (tenant_id = (current_setting('app.current_tenant_id')::UUID));

-- Trigger to auto-update updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);
