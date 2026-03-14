-- Phase 9 Billing: Industry-standard upgrade/downgrade architecture
-- Adds scheduled downgrade tracking and billing cycle end date to tenants

ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS scheduled_plan_id UUID REFERENCES public.plans(id),
  ADD COLUMN IF NOT EXISTS scheduled_plan_effective_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS billing_cycle_end TIMESTAMPTZ;

-- Backfill billing_cycle_end for existing tenants (30 days from cycle start)
UPDATE public.tenants
SET billing_cycle_end = billing_cycle_start + INTERVAL '30 days'
WHERE billing_cycle_end IS NULL AND billing_cycle_start IS NOT NULL;

-- For tenants without a cycle start, set now + 30 days
UPDATE public.tenants
SET
  billing_cycle_start = NOW(),
  billing_cycle_end   = NOW() + INTERVAL '30 days'
WHERE billing_cycle_start IS NULL;

-- Ensure Starter plan exists (it was in migration 007 but may be missing in some envs)
INSERT INTO public.plans (id, name, max_monthly_emails, max_contacts, allow_custom_domain, price_monthly)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Free',       1000,    500,    FALSE, 0.00),
  ('22222222-2222-2222-2222-222222222222', 'Starter',    10000,   5000,   FALSE, 29.00),
  ('33333333-3333-3333-3333-333333333333', 'Pro',        100000,  50000,  TRUE,  99.00),
  ('44444444-4444-4444-4444-444444444444', 'Enterprise', 1000000, 500000, TRUE,  499.00)
ON CONFLICT (name) DO UPDATE SET
  max_monthly_emails  = EXCLUDED.max_monthly_emails,
  max_contacts        = EXCLUDED.max_contacts,
  allow_custom_domain = EXCLUDED.allow_custom_domain,
  price_monthly       = EXCLUDED.price_monthly;
