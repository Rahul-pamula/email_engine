-- ========================================================
-- ONBOARDING FLOW: ADD NEW FIELDS TO TENANTS TABLE
-- ========================================================

-- Add new onboarding fields to tenants table
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS workspace_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_role VARCHAR(50),
ADD COLUMN IF NOT EXISTS primary_use_case VARCHAR(100),
ADD COLUMN IF NOT EXISTS integration_sources TEXT[],
ADD COLUMN IF NOT EXISTS expected_scale VARCHAR(50);

-- Add comment
COMMENT ON COLUMN tenants.workspace_name IS 'Workspace/Company name from onboarding';
COMMENT ON COLUMN tenants.user_role IS 'User role: Founder, Developer, Marketer, Other';
COMMENT ON COLUMN tenants.primary_use_case IS 'Primary use case: transactional, marketing, event_based, exploring';
COMMENT ON COLUMN tenants.integration_sources IS 'Array of integration sources: api_webhooks, web_app, mobile_app, ecommerce, not_sure';
COMMENT ON COLUMN tenants.expected_scale IS 'Expected monthly events: testing, less_1k, 1k_10k, 10k_plus';
