-- ========================================================
-- ULTIMATE EMAIL PLATFORM: ENTERPRISE SCHEMA (17 TABLES)
-- Phase 1: The Foundation
-- Supports: Engine Core + Project 1 (Contact Management)
-- ========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. INFRASTRUCTURE & TENANCY
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    api_key_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('transactional', 'marketing', 'dev')),
    daily_quota INT DEFAULT 1000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    domain_name TEXT NOT NULL UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    dkim_selector TEXT DEFAULT 'engine',
    dkim_private_key TEXT,
    spf_record TEXT,
    dmarc_policy TEXT DEFAULT 'v=DMARC1; p=none;',
    mta_sts_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. IP REPUTATION (ELITE / ISP-AWARE)
CREATE TABLE IF NOT EXISTS ip_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS ip_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID REFERENCES ip_pools(id),
    ip_addr INET NOT NULL UNIQUE,
    ptr_record TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ip_isp_warmup_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_id UUID REFERENCES ip_addresses(id) ON DELETE CASCADE,
    isp TEXT NOT NULL, -- 'gmail', 'outlook', 'yahoo', 'other'
    score INT DEFAULT 40 CHECK (score >= 0 AND score <= 100),
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    total_sent BIGINT DEFAULT 0,
    success_count BIGINT DEFAULT 0,
    hard_bounce_count BIGINT DEFAULT 0,
    soft_bounce_count BIGINT DEFAULT 0,
    complaint_count BIGINT DEFAULT 0,
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ip_id, isp)
);

-- 4. PROJECT 1: DATA & CONTACT MANAGEMENT
CREATE TABLE IF NOT EXISTS contact_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'phone', 'date', 'long_text', 'radio', 'dropdown', 'checkbox')),
    options JSONB, -- For dropdown/radio/checkbox choices
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    list_id UUID REFERENCES contact_lists(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, email)
);

CREATE TABLE IF NOT EXISTS contact_field_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    field_id UUID REFERENCES contact_fields(id) ON DELETE CASCADE,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(contact_id, field_id)
);

-- 5. CAMPAIGN PIPELINE
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    body_snapshot TEXT NOT NULL,
    subject_snapshot TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. THE ENGINE QUEUE (OBSERVABILITY: TRACE_ID)
CREATE TABLE IF NOT EXISTS email_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id UUID NOT NULL, -- End-to-end trace
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id),
    snapshot_id UUID REFERENCES campaign_snapshots(id),
    recipient_email TEXT NOT NULL,
    recipient_domain TEXT NOT NULL,
    recipient_isp TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'deferred', 'hold')),
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    next_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    payload_rendered TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANALYTICS & LOGS
CREATE TABLE IF NOT EXISTS email_tasks_dead (
    task_id UUID PRIMARY KEY REFERENCES email_tasks(id),
    trace_id UUID NOT NULL,
    failure_reason TEXT,
    last_smtp_response TEXT,
    failed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS delivery_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES email_tasks(id),
    trace_id UUID NOT NULL,
    ip_id UUID REFERENCES ip_addresses(id),
    smtp_conv_json JSONB,
    status_code INT,
    status_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES email_tasks(id),
    trace_id UUID NOT NULL,
    event_type TEXT CHECK (event_type IN ('open', 'click')),
    ip_addr INET,
    user_agent TEXT,
    is_bot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EMERGENCY BRAKE
CREATE TABLE IF NOT EXISTS hold_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    project_id UUID REFERENCES projects(id),
    recipient_domain TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INDEXES
CREATE INDEX idx_tasks_pending_retry ON email_tasks (status, next_attempt_at) WHERE status = 'pending';
CREATE INDEX idx_tasks_trace_id ON email_tasks (trace_id);
CREATE INDEX idx_contacts_email ON contacts (project_id, email);

-- ========================================================
-- ISP-AWARE WARMUP SCORING ENGINE (BillionMail Math implementation)
-- ========================================================

CREATE OR REPLACE FUNCTION evaluate_ip_isp_warmup_score(target_id UUID)
RETURNS VOID AS $$
DECLARE
    v_score INT;
    v_success_rate FLOAT;
    v_total BIGINT;
    v_success BIGINT;
    v_hard_bounce BIGINT;
    v_soft_bounce BIGINT;
    v_complaints BIGINT;
BEGIN
    -- 1. Get current stats
    SELECT total_sent, success_count, hard_bounce_count, soft_bounce_count, complaint_count, score
    INTO v_total, v_success, v_hard_bounce, v_soft_bounce, v_complaints, v_score
    FROM ip_isp_warmup_stats
    WHERE id = target_id;

    IF v_total < 20 THEN
        RETURN;
    END IF;

    -- 2. Success Rate
    v_success_rate := v_success::FLOAT / v_total::FLOAT;

    -- 3. Adaptive Scoring Logic
    -- Success Bonus: +30 points if above 80% success
    IF v_success_rate > 0.8 THEN
        v_score := v_score + ((v_success_rate - 0.8) * 30);
    END IF;

    -- 4. Penalties (Elite Deliverability Math)
    -- Hard bounces: Heavy penalty (-5 points per bounce)
    -- Soft bounces: Medium penalty (-1 point per bounce)
    -- Complaints (FBL): CRITICAL penalty (-20 points per complaint)
    v_score := v_score - (v_hard_bounce * 5);
    v_score := v_score - (v_soft_bounce * 1);
    v_score := v_score - (v_complaints * 20);

    -- 5. Clamp (0-100)
    v_score := GREATEST(0, LEAST(100, v_score));

    -- 6. Update
    UPDATE ip_isp_warmup_stats
    SET score = v_score,
        progress = LEAST(100, progress + 1),
        last_evaluated_at = NOW(),
        updated_at = NOW()
    WHERE id = target_id;

END;
$$ LANGUAGE plpgsql;

-- 10. ROW LEVEL SECURITY (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_on_projects ON projects USING (tenant_id = auth.uid());
CREATE POLICY project_isolation_on_contacts ON contacts USING (project_id IN (SELECT id FROM projects WHERE tenant_id = auth.uid()));
CREATE POLICY project_isolation_on_lists ON contact_lists USING (project_id IN (SELECT id FROM projects WHERE tenant_id = auth.uid()));
CREATE POLICY project_isolation_on_campaigns ON campaigns USING (project_id IN (SELECT id FROM projects WHERE tenant_id = auth.uid()));
CREATE POLICY project_isolation_on_tasks ON email_tasks USING (project_id IN (SELECT id FROM projects WHERE tenant_id = auth.uid()));
