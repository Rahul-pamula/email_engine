-- =====================================================
-- Phase 1.5 Migration: Auth Security Tables
-- Run this in Supabase SQL editor
-- =====================================================

-- 1. AUDIT LOGS TABLE
-- Tracks: who did what, when, on which record
-- PRIVACY RULE: Never log PII (no email bodies, CSV content, passwords)
-- Only log METADATA (user X deleted contact Y, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,    -- e.g. 'contact.delete', 'campaign.send'
    resource_type VARCHAR(50),            -- e.g. 'contact', 'campaign', 'template'
    resource_id UUID,                     -- ID of the affected record
    metadata    JSONB DEFAULT '{}',       -- Non-PII context only
    ip_address  INET,                     -- Client IP for security auditing
    user_agent  TEXT,                     -- Browser for security auditing
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Required indexes (from DB Index Strategy)
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_timestamp
    ON audit_logs(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action);


-- =====================================================
-- 2. PASSWORD RESET TOKENS TABLE
-- Used for forgot password flow
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) UNIQUE NOT NULL,  -- secure random token (64 hex chars)
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL, -- 1 hour from creation
    used_at     TIMESTAMP WITH TIME ZONE,       -- set when token is consumed
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token
    ON password_reset_tokens(token);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
    ON password_reset_tokens(user_id, created_at DESC);


-- =====================================================
-- 3. EMAIL VERIFICATION TOKENS TABLE
-- Used for verifying email on signup
-- =====================================================
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) UNIQUE NOT NULL,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL, -- 24 hours from creation
    used_at     TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token
    ON email_verification_tokens(token);


-- =====================================================
-- 4. Add email_verified column to users if missing
-- =====================================================
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
