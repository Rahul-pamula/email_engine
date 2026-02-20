━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 EMAIL ENGINE — COMPLETE PHASE PLAN
 (Updated: Backend + UI/UX + Notifications)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each phase has TWO parts:
  [BACKEND] — API, database, worker logic
  [FRONTEND] — Pages, components, UX flows

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

� PHASE 0 — UI/UX Design System (Do FIRST before any new page)
  WHY: Currently pages use inline styles + hardcoded hex colors.
       This makes each page look different and inconsistent.
       Do this once → all future pages look professional automatically.

  [SETUP — One Time, ~1 Day]
  ☐ Install shadcn/ui (40+ professional components pre-built)
      → npx shadcn-ui@latest init
      → Add: Button, Card, Badge, Table, Dialog, Toast, Tabs, Select, Progress
  ☐ Install Google Font (Inter) in layout.tsx
      → Inter is what Mailchimp, Vercel, Linear, Notion use

  [DESIGN TOKENS — globals.css — Define Once, Use Everywhere]
  ☐ CSS Color Variables (never hardcode hex colors in components again):
      --bg-primary:    #0F172A   (page background)
      --bg-card:       #1E293B   (card surface)
      --bg-hover:      #293548   (hover state)
      --accent:        #3B82F6   (primary blue CTA)
      --accent-purple: #8B5CF6   (secondary / gradients)
      --text-primary:  #F1F5F9   (headings, labels)
      --text-muted:    #94A3B8   (descriptions, placeholders)
      --border:        #334155   (card borders, dividers)
      --success:       #10B981   (green — sent, verified)
      --warning:       #F59E0B   (yellow — 80% quota, paused)
      --danger:        #EF4444   (red — failed, blocked)
  ☐ Typography scale:
      H1: 28px bold  | H2: 20px semibold | H3: 16px semibold
      Body: 14px     | Caption: 12px     | Mono: 13px (for IDs, codes)

  [REUSABLE COMPONENTS — Follow Atomic Design Principle]
  Components are organized in 3 layers so new developers understand at a glance:

  ATOMS — Single purpose, no sub-components:
  ☐ Button.tsx        → Primary, secondary, danger, ghost variants
  ☐ Badge.tsx         → Small pill label (Free, Pro, Active)
  ☐ HealthDot.tsx     → 🟢🟡🔴 colored dot with label
  ☐ LoadingSpinner.tsx → Spinner on buttons while API awaits

  MOLECULES — Combined atoms:
  ☐ StatCard.tsx      → Large number + label + trend (↑12%)
  ☐ StatusBadge.tsx   → Colored pill: sent/draft/failed/paused/active/throttled
  ☐ ConfirmModal.tsx  → "Are you sure?" popup with confirm/cancel buttons
  ☐ Toast system      → Success/warning/error popup notifications

  ORGANISMS — Full sections with multiple molecules:
  ☐ PageHeader.tsx    → Title + subtitle + right-side action button
  ☐ DataTable.tsx     → Table + search bar + sort + pagination
  ☐ EmptyState.tsx    → Icon + message + CTA when list is empty
  ☐ Breadcrumb.tsx    → Campaigns > Holiday Sale > Analytics (back navigation)

  SETUP:
  ☐ tailwind.config.js → Map CSS variables to Tailwind class names:
      → bg-primary, text-muted, border-subtle usable in className="bg-primary"

  [STANDARD PAGE LAYOUT — Every New Page Follows This]
      1. <PageHeader title="Contacts" action={<Button>Import</Button>} />
      2. <StatsRow>  — 3 to 4 StatCards (key metrics at a glance)
      3. <DataTable> — Main content (table, cards, or form)
      4. <EmptyState>— Shown if table has 0 rows (not a blank white box!)

  [UX RULES — Non-Negotiable on Every Page]
  ☐ Every delete action → show ConfirmModal first
  ☐ Every form submit  → show loading spinner on button while waiting
  ☐ Every API success  → show Toast: "✅ Contacts imported successfully"
  ☐ Every API error    → show Toast: "❌ Something went wrong. Try again."
  ☐ Every empty list   → show EmptyState with helpful CTA button
  ☐ Every list page    → has search input + at least one filter option
  ☐ Mobile responsive  → sidebar hidden on mobile, hamburger menu added

  [ACCESSIBILITY — WCAG 2.1 AA]
  ☐ FIX globals.css → Remove or override "*:focus { outline: none }" if it exists
      → A simple :focus-visible is not enough if the * selector has higher precedence.
      → Ensure the hard reset is completely removed. Replace with:
         *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  ☐ Color contrast: --text-muted (#94A3B8) on --bg-card (#1E293B) = 5.6:1 ✅ passes
  ☐ Keyboard navigation for all modals (Escape to close, Tab through buttons)
  ☐ ARIA labels on all icon-only buttons (e.g. delete, edit, close)
  ☐ Minimum 44x44px touch targets on all buttons (mobile)

  [LOCAL DEVELOPMENT SETUP]
  ☐ Add Mailhog to docker-compose.yml as dev-only service:
      → docker-compose --profile dev  → starts Mailhog on port 8025
      → Mailhog = fake SMTP server, all emails go to web UI, not real inboxes
      → Developers can test emails without needing Amazon SES credentials
  ☐ Seed data script (scripts/seed_dev_data.py):
      → Creates: 1 tenant, 500 fake contacts, 3 templates, 2 campaigns
      → New developer runs this once to get a realistic test environment
  ☐ .env.example file with ALL variables documented
      → Every variable has a comment explaining what it does

  NOTE: Phase 0 = 1 day. Saves 2 weeks of fixing inconsistent UIs later.
        Priority: Do before Phase 1.5 or Phase 3 frontend work.

─────────────────────────────────────────
�🏗 PHASE 1 — Foundation ✅ DONE
  [BACKEND]
  ✔ Auth (Clerk JWT)
  ✔ Multi-tenant isolation (RLS)
  ✔ Onboarding flow
  ✔ JWT middleware

  [FRONTEND]
  ✔ Login page
  ✔ Signup page
  ✔ Onboarding wizard (org name, country, address)
  ✔ Sidebar navigation layout

  NOTE: Forgot password page is broken (custom code bypasses Clerk).
        Fix in Phase 1.5.

─────────────────────────────────────────
🏗 PHASE 1.5 — Auth Cleanup
  [BACKEND]
  ☐ Remove custom /auth/forgot-password endpoint
  ☐ Remove custom /auth/reset-password endpoint
  ☐ Audit logs table (record: who did what, when, on which record)
      → Log: contact deletes, campaign sends, plan changes, login events
      → Columns: tenant_id, user_id, action, resource_type, resource_id, timestamp
      → PRIVACY RULE: Never log sensitive data (no CSV content, no email body)
      → Only log METADATA: "User X uploaded file Y with 500 contacts" ✅
      → Never log: actual email addresses, CSV rows, email HTML content ❌

  [FRONTEND]
  ☐ Fix forgot-password page → use Clerk's useSignIn hook
  ☐ Fix reset-password page → use Clerk's built-in flow
  ☐ Enable Social Auth (Google) in Clerk Dashboard (no code needed)
  ☐ Test: sign up → verify email → login → forgot password → reset
  ☐ Audit log viewer (admin can see who deleted 10,000 contacts and when)

─────────────────────────────────────────
🏗 PHASE 1.6 — GDPR / Legal Compliance
  WHY: Real EU customers can legally demand data export or deletion.
       Build this before onboarding paying customers.

  [BACKEND]
  ☐ Data export API (Async Process):
      → POST /tenant/export-data → creates job, returns 202 Accepted + job_id
      → GET /tenant/export-data/status/{job_id} → checks progress
      → GET /tenant/export-data/download/{job_id} → downloads ZIP (expires in 7 days)
      → Prevents timeout issues when exporting large contact lists
  ☐ Right to be forgotten: DELETE /contacts/{id}/anonymize
      → Does NOT delete the row (breaks analytics history)
      → Overwrites PII: email → "deleted@gdpr.invalid", name → "[Deleted]"
      → Keeps campaign stats intact (we sent X emails to Y contacts)
  ☐ Soft delete pattern (add to ALL main tables):
      → Add deleted_at TIMESTAMP NULL column to: contacts, campaigns, templates
      → All queries filter WHERE deleted_at IS NULL
      → 30-day retention window before permanent erasure
  ☐ Consent tracking:
      → Add: consent_source, consent_date, consent_ip to contacts table
      → Captured at import time ("Uploaded via CSV on 2026-02-20")

  [FRONTEND]
  ☐ Restore modal for soft-deleted items:
      → "This contact was deleted 5 days ago. Restore?"
      → Available for 30 days after deletion
  ☐ Data export button in Settings:
      → "Download all my data" → generates ZIP, emails download link
  ☐ Consent column visible in contacts table
  ☐ Privacy policy / Terms page linked from footer (even if just external links)

─────────────────────────────────────────
🏗 PHASE 2 — Contacts Engine ✅ DONE
  [BACKEND]
  ✔ CSV/XLSX ingestion
  ✔ Deduplication
  ✔ Contact status (subscribed, unsubscribed, bounced)
  ✔ Segmentation filters
  ✔ Bulk delete

  [FRONTEND]
  ✔ Contacts list page (table with search, filter, pagination)
  ✔ Import contacts modal (CSV/XLSX drag & drop)
  ✔ Contact status badges (subscribed / unsubscribed / bounced)
  ✔ Segment builder UI (filter by field, value)
  ✔ Bulk action buttons (delete selected)

  [MISSING UI]
  ☐ Contact detail page (see individual contact activity)
  ☐ Export contacts to CSV button
  ☐ Tags UI (add/remove tags on contacts)
  ☐ Suppression list page (view bounced/spam contacts)

  [MISSING BACKEND]
  ☐ Contact search endpoint (search by email, name, tag)
  ☐ Tags CRUD API (add/remove/list tags per contact)
  ☐ Soft delete: deleted_at column on contacts (restore within 30 days)
      → GET /contacts returns only WHERE deleted_at IS NULL
      → GET /contacts/deleted returns soft-deleted contacts
      → POST /contacts/{id}/restore → sets deleted_at = NULL

─────────────────────────────────────────
🏗 PHASE 3 — Template Engine ⚠ STABILIZED
  [BACKEND]
  ✔ Template CRUD
  ✔ Category
  ✔ Store compiled HTML
      → SECURITY: HTML must be aggressively sanitized (bleach on backend, DOMPurify on frontend)
      → Disallow <script> tags, restrict external JS, limit inline event handlers
      → Prevents critical XSS attacks via malicious templates
  ✔ Preset templates (35 presets)
  ☐ Template versioning (save history)
  ☐ Plain text auto-generator (sync from HTML for spam filters)
      → Store in DB, allow manual override via frontend UI.
  ☐ Public "View Online" link (render template in browser without login)

  [FRONTEND]
  ✔ Templates list page (grid of template cards with thumbnails)
  ✔ Create template (pick preset)
  ☐ Simple HTML Template Editor (text area for code + live preview)
      → Launch this first to unblock campaigns faster.
      → Tabs: HTML | Plain Text (Auto-generated) | Plain Text (Custom)
      → Lets users override generated plain text if formatting breaks.
  ☐ Preview panel with 3 toggles:
      → 📱 Mobile view
      → 💻 Desktop view
      → 🌙 Dark mode view (critical: logos/colors often break in dark mode)
  ☐ Send test email button (enter email address → receive real email)
  ☐ Duplicate template button
  ☐ Category filter tabs on template list
  ☐ Version history panel (see and restore older versions)
  ☐ Dynamic placeholder guide (show list of {{merge_tags}} user can use)
  NOTE: A/B testing on templates → Phase 10
        AI copy assistant → Phase 10
        Global shared components → Phase 8
        Conditional blocks → Phase 10


─────────────────────────────────────────
🏗 PHASE 4 — Campaign Orchestration ✅ DONE
  [BACKEND]
  ✔ Campaign CRUD
  ✔ Snapshot HTML + recipients
  ✔ Insert email_tasks
  ✔ Spintax + merge tags
  ☐ Scheduled sending (cron trigger at scheduled_at)
  ☐ Pause/resume campaign
  ☐ Cancel campaign mid-send
  ☐ Resend to unopened contacts

  [FRONTEND]
  ✔ Campaigns list page (status badges, stats)
  ✔ Create campaign form (name, subject, template, audience)
  ✔ Campaign detail page (basic)
  ☐ Campaign creation wizard (step-by-step: content → audience → schedule → review)
  ☐ Pre-send checklist popup (before "Send" button works):
      → Template has unsubscribe link ✅/❌
      → Domain is verified ✅/❌
      → Audience has > 0 contacts ✅/❌
      → Bounce rate is acceptable ✅/❌
  ☐ Schedule picker (date/time input for scheduled send)
  ☐ Pause button / Cancel button on in-progress campaign
  ☐ Send test email modal (enter email address, preview)
  ☐ Advanced Template Editor — GrapesJS rebuild (drag & drop)
      → Upgrade from Phase 3's simple HTML editor.
      → No MJML. Store HTML directly.
      → Use GrapesJS email preset for Outlook-safe table layout.

─────────────────────────────────────────
🏗 PHASE 5 — Delivery Engine ✅ DONE
  [BACKEND]
  ✔ Worker loop (DB polling)
  ✔ SMTP send
  ✔ Retry + dead-letter queue
  ☐ Unsubscribe link injected automatically into every email
  ☐ Physical business address in email footer (CAN-SPAM)
  ☐ Hard bounce → auto-mark contact as "bounced"
  ☐ Spam complaint → auto-mark contact as "unsubscribed"
  ☐ Daily send limit enforcement
  ☐ Email Sending Reputation Isolation:
      → Track per-tenant reputation score (bounce rate, spam rate)
      → Auto-suspend tenant if bounce_rate > 5% or spam_rate > 0.3%
      → Move risky tenants to lower priority delivery queue
      → CRITICAL to prevent one bad tenant from destroying shared IP reputation
  ☐ List Hygiene Automation:
      → Auto-suppress emails that bounced 3x in 30 days
      → Re-engagement campaign trigger for 6-month inactive contacts
      → Sunset policy: Mark as 'inactive' after 12 months, and suppress from future campaigns unless manually re-activated.
          - Confirmation modal: "This contact is inactive. Send a re-engagement email? (Yes / No / Permanently Suppress)"
  ☐ Warm-up throttle for new tenants:
      → First 3 days: limit to 50 emails/hour
      → Day 4–7: 200 emails/hour
      → Day 8+: full speed
      → Protects shared IP reputation from dirty/cold lists

  [FRONTEND]
  ☐ Unsubscribe landing page (/unsubscribe?token=xxx)
      → Clean, friendly page: "You have been unsubscribed."
  ☐ Re-subscribe option on unsubscribe page
  ☐ Campaign throttle status display:
      → If campaign is under warm-up limit, show status: "⏳ Throttled"
      → NOT "Stuck" or "Failed" — users must know it's intentionally slow
      → Show: "Sending at 50/hr — 94 hours remaining" so user is informed
      → IMPORTANT: 5,000 emails ÷ 50/hr = 100 hours — user must know this upfront

─────────────────────────────────────────
🏗 PHASE 6 — Observability & Analytics
  [BACKEND]
  ☐ Open tracking pixel endpoint
  ☐ Click tracking redirect endpoint
  ☐ Webhook ingestion (Gmail/Outlook bounce/spam reports)
  ☐ Stats aggregation (sent, opens, clicks, bounces per campaign)
  ☐ Contact activity log (what each person opened/clicked)
  ☐ Bot/Scanner detection:
      → If click happens < 1 second after open → mark as bot, exclude from stats
      → Prevents inflated click stats from email security scanners (common in enterprise)
      → Store: opened_at, clicked_at, is_bot flag

  [FRONTEND]
  ☐ Campaign detail page (full analytics):
      → Sent / Delivered / Opened / Clicked / Bounced / Unsubscribed
      → Charts (open rate over time, top clicked links)
      → Recipient list (who opened, who clicked, who bounced)
  ☐ Dashboard homepage widgets:
      → Recent campaign performance summary
      → Sender Health card:
          - Bounce rate (🟢 < 2%  🟡 2-5%  🔴 > 5%)
          - Spam rate   (🟢 < 0.1% 🟡 0.1-0.5% 🔴 > 0.5%)
          - Open rate   (🟢 > 20%  🟡 10-20%  🔴 < 10%)
          - Domain status (verified ✅ / not verified ❌)
  ☐ Contacts activity tab (per contact: opened X campaigns, clicked Y)
  ☐ Export report to CSV button

─────────────────────────────────────────
🏗 PHASE 7 — Plan Enforcement
  [BACKEND]
  ☐ Plans table (free/starter/pro/enterprise with limits)
      → Free tier limits: Max 500 contacts, 1,000 emails/month, no custom domain (forces upgrade)
  ☐ Monthly email sent counter per tenant
  ☐ Block sends when quota exceeded
  ☐ Contact count limit enforcement
  ☐ 80% quota trigger (notification)
  ☐ Worker-triggered email notifications:
      → Campaign completed → email tenant with stats summary
      → 80% quota reached → email tenant quota warning
      → Monthly 1st → email tenant usage summary
      → Bounce rate > 2% → email tenant list-cleaning alert

  [FRONTEND]
  ☐ Plan & Usage page:
      → Current plan badge (Free / Starter / Pro)
      → Emails used this month: 8,400 / 25,000 (progress bar)
      → Contacts: 3,200 / 10,000 (progress bar)
      → "Upgrade Plan" button → shows plan comparison table
  ☐ Upgrade plan modal (shows plan comparison, "Contact Us to Upgrade")
  ☐ In-app banner when 80% quota reached:
      "⚠️ You've used 80% of your monthly emails. Upgrade to continue."
  ☐ Blocked send page when quota maxed:
      "❌ Monthly limit reached. Your campaign cannot be sent."

─────────────────────────────────────────
🏗 PHASE 7.5 — Infrastructure ✅ PARTIALLY DONE
  [BACKEND / DEVOPS]
  ✔ Docker (Dockerfiles for API, worker, client)
  ✔ docker-compose.yml
  ✔ Nginx config
  ☐ SSL/HTTPS (Let's Encrypt guide in docs)
  ☐ CI/CD pipeline (GitHub Actions)
  ☐ Load & Spam Testing Setup:
      → k6 script for contact import (10k rows) and campaign creation
      → Integration with Mail-Tester.com API for pre-send spam score checks
      → Postman/Insomnia collection for all major API endpoints
  ☐ Security Headers & CSP:
      → Add Content-Security-Policy headers for all Next.js pages
      → Strict CSP for editor (mitigate inline style risks)
  ☐ API Rate Limiting (Strict, Per-Tenant, Per-Endpoint):
      → Must include burst protection and use tenant_id (not just IP)
      → Import contacts: max 5/min | Campaign create: 10/min | Test email: 20/hour
      → Essential to prevent malicious tenants from overloading DB and Worker
  ☐ Background Job Status Table:
      → Generic `jobs` table: id, tenant_id, type, status, progress_percent, error_message
      → Used for CSV import, GDPR export, Campaign send compilation
      → Frontend polls this table so users actually see a progress bar instead of waiting blindly
  ☐ Worker concurrency safety:
      → Add locked_by (UUID) column to email_tasks
      → Worker claims task by writing its own ID to locked_by
      → Prevents zombie tasks when 2+ workers run in parallel
  ☐ Idempotency guard:
      → Add external_msg_id column to email_tasks
      → Store SMTP provider's message ID after first successful send
      → On retry: check external_msg_id exists → skip send → prevent double-email

  [FRONTEND]
  ☐ Settings → SMTP Config page:
      → Input fields: SMTP Host, Port, Username, Password
      → "Test Connection" button → shows success/failure
  ☐ Settings → Domain Verification page:
      → Enter sending domain
      → Show DNS records to add (SPF/DKIM)
      → "Verify" button → checks DNS

  [HEALTH CHECKS]
  ☐ GET /health endpoint on FastAPI:
      → Returns: { status: "ok", db: "connected", worker: "running" }
      → Returns 200 OK if healthy, 503 if any service is down
      → Company IT team monitors this for uptime alerts
  ☐ GET /health endpoint on Worker (separate HTTP server):
      → Returns: { status: "ok", queue_depth: 142, last_processed: "2s ago" }
  → Both endpoints used by docker-compose healthcheck + external monitors

─────────────────────────────────────────
🏗 PHASE 8 — Admin Panel (Company Dashboard)
  [BACKEND]
  ☐ Super admin role + separate auth
  ☐ Get all tenants + usage API
  ☐ Change tenant plan API
  ☐ Suspend/reactivate tenant API
  ☐ Global Kill Switch API:
      → Single endpoint: POST /admin/kill-switch
      → Sets a global flag in DB: is_sending_paused = true
      → Worker checks this flag before every send → if true, stops immediately
      → USE CASE: Tenant sending spam → admin freezes entire engine in 1 click
      → Per-tenant kill switch too: suspend one tenant without stopping others

  [FRONTEND]
  ☐ Admin login page (separate from tenant login)
  ☐ Admin dashboard:
      → Total tenants, active tenants, suspended tenants
      → Total emails sent platform-wide this month
      → Revenue overview (manual, based on plans)
  ☐ Tenant list table (name, plan, usage, status)
  ☐ Tenant detail page (change plan, view usage, suspend)
  ☐ SMTP health monitor page
  ☐ Global Kill Switch button (big red button, requires confirmation):
      → "⛔ Stop All Email Sending" → ConfirmModal → activates kill switch
      → Status shows: "🔴 Sending Paused" with timestamp and "Resume" button

─────────────────────────────────────────
🏗 PHASE 9 — Payments (Stripe/Razorpay)
  [BACKEND]
  ☐ Stripe integration
  ☐ Webhook from Stripe → update plan in DB
  ☐ Invoice generation

  [FRONTEND]
  ☐ Pricing page (plan comparison table with "Subscribe" button)
  ☐ Checkout flow (Stripe hosted page or embedded)
  ☐ Billing history page (past invoices, download PDF)
  ☐ Payment failed banner ("Your payment failed. Update card to continue.")

─────────────────────────────────────────
🏗 PHASE 10 — Advanced Campaigns
  [BACKEND]
  ☐ A/B test variant storage
  ☐ Winner selection logic (by open rate after 4 hours)
  ☐ Drip campaign sequence engine
  ☐ Automation trigger system

  [FRONTEND]
  ☐ A/B test creation UI (add Subject Line B, set split ratio)
  ☐ A/B test results panel (variant A vs B comparison)
  ☐ Drip campaign builder (sequence of emails + delays)
  ☐ Automation trigger builder (e.g., "Send email when contact joins list")

─────────────────────────────────────────
🏗 PHASE 11 — API & Integrations
  [BACKEND]
  ☐ API key management
  ☐ Transactional send API (/v1/send)
  ☐ Webhook output (notify tenant on open/click)

  [FRONTEND]
  ☐ API Keys page (generate, view, revoke keys)
  ☐ Webhooks config page (enter URL, select events)
  ☐ Developer docs page (embedded docs or link)

─────────────────────────────────────────
🏗 PHASE 12 — Scale (After Handover)
  [BACKEND]
  ☐ Redis queue (replace DB polling)
  ☐ IP warmup scheduler (auto-increase limits over 30 days)
  ☐ Blacklist monitoring (check MXToolbox daily via cron)
  ☐ Bot filtering (fake opens from email security scanners)
  ☐ Per-tenant custom sending domain backend (DKIM key generation)

  [MICROSERVICES MIGRATION — When team > 5 developers]
  ☐ Break monolith into independent services:
      auth-service         → Only handles login, JWT, tenants
      contacts-service     → Only handles contacts, segments, tags
      template-service     → Only handles templates, editor, previews
      campaign-service     → Only handles campaigns, scheduling
      delivery-service     → Only handles SMTP worker, retries
      analytics-service    → Only handles open/click tracking, reports
      notification-service → Only sends system emails to tenants
  ☐ API Gateway (Nginx/Kong) → single entry point routing to each service
  ☐ Each service has its own Docker container
  ☐ Services communicate via REST or message queue (RabbitMQ/Kafka)
  WHY: If analytics crashes → rest of app still works.
       If delivery is slow → scale only that service, not the entire app.
  NOTE: Do NOT do this before Phase 12. Current monolith is perfectly fine
        for up to ~100k emails/day and a small team.

  [FRONTEND]
  ☐ Custom domain setup wizard (tenant enters domain → gets DNS records → verifies)
  ☐ IP warmup status page (shows daily send limit and progression)
  ☐ Platform health dashboard (admin sees Redis queue depth, worker status)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 USER NOTIFICATIONS — What to tell tenants
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IN-APP NOTIFICATIONS (toast / banner in UI):
  ✉ Campaign sent successfully (X emails queued)
  ⚠ Campaign paused (user action)
  ❌ Campaign failed to send (SMTP error)
  ⚠ 80% of monthly email quota used
  ❌ Monthly email quota reached — sends blocked
  ⚠ Bounce rate exceeded 2% — list needs cleaning
  ⚠ Spam complaint rate exceeded 0.1% — action needed
  ✅ Domain verified successfully
  ❌ SMTP connection failed — check your settings

EMAIL NOTIFICATIONS (sent to tenant's email):
  ✉ Welcome email (after onboarding complete)
  ✉ Campaign completed: "Your campaign 'Black Friday' is done.
     Sent: 10,000 | Opened: 2,400 (24%) | Clicked: 540 (5.4%)"
  ⚠ "You've used 80% of your monthly email limit"
  ❌ "Monthly limit reached. Upgrade to continue sending."
  ⚠ "Your bounce rate is 3.5% — please clean your list"
  ⚠ "Spam complaints detected on your last campaign"
  ✉ Monthly usage summary (every 1st of month)
  ✉ Invoice/receipt (after payment — Phase 9)
  ❌ "Payment failed — please update your card" (Phase 9)

SYSTEM/LEGAL EMAILS (sent inside campaigns to end users):
  ✉ Unsubscribe confirmation: "You have been unsubscribed."
  ✉ Every campaign email MUST have:
      → Unsubscribe link at bottom
      → Company physical address in footer
      → Sender's name clearly visible in From field

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HANDOVER PRIORITY (1 MONTH)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Must finish before handover:
  Phase 1.5  → Auth fixes + Google login
  Phase 3    → Template editor + preview
  Phase 4    → Campaign wizard + pre-send checklist
  Phase 5    → Unsubscribe page + bounce handling
  Phase 6    → Analytics page + Sender Health dashboard
  Phase 7    → Plan limits + usage page + quota banners

Document for company to pay & build later:
  Phase 8    → Admin panel
  Phase 9    → Stripe payments
  Phase 10   → A/B testing + drip campaigns
  Phase 11   → API & integrations
  Phase 12   → Redis + scale

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DATABASE INDEX STRATEGY (CRITICAL FOR SCALE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Without these indexes, the platform will slow down dramatically at scale:
  ☐ contacts(tenant_id, email) → fast deduplication during CSV import
  ☐ email_tasks(status, scheduled_at) → ultra-fast worker polling
  ☐ campaigns(tenant_id, status) → fast dashboard loading
  ☐ audit_logs(tenant_id, timestamp) → fast log retrieval for GDPR
  ☐ email_events(campaign_id, contact_id) → fast analytics aggregation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HANDOVER RUNBOOKS (Docs for the company)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These are NOT code. They are written guides you hand to the company.

RUNBOOK 1: "What to do if your IP gets Blacklisted"
  Step 1: Check IP reputation using these tools (use all 3 for thorough check):
      → mxtoolbox.com             (main site → Blacklist Check tab)
      → multirbl.valli.org        (checks 200+ blacklists at once)
      → check.spamhaus.org        (most authoritative — Gmail/Outlook use this)
  Step 2: Identify which campaign caused it (high bounce/spam rate)
  Step 3: Submit delisting request to the blacklist provider (usually free)
  Step 4: Clean the contact list that caused the issue
  Step 5: Switch to a new sending IP (SES supports dedicated IPs)
  Step 6: Re-enable warm-up throttle for the new IP
  PRO TIP: AWS SES Dashboard shows your sending reputation score.
           Check it weekly — it drops before you get blacklisted, giving you warning.

RUNBOOK 2: "How to upgrade from DB Queue to Redis (Phase 12)"
  Step 1: Add Redis to docker-compose.yml (pre-written, just uncomment)
  Step 2: Install: pip install celery redis
  Step 3: Create celery app that reads from Redis instead of DB polling
  Step 4: Keep the old DB queue as a fallback for 1 week
  Step 5: Monitor: all tasks processed → remove old DB polling worker
  CRITICAL: external_msg_id column prevents double-sends during migration

RUNBOOK 3: "Monthly operations checklist for the company"
  ☐ Check bounce rate (keep below 2%)
  ☐ Check spam complaint rate (keep below 0.1%)
  ☐ Review email_tasks_dead table (failed emails) — investigate patterns
  ☐ Check mxtoolbox.com/blacklists for IP reputation
  ☐ Review audit_logs for any unusual mass deletes or sends
  ☐ Review tenant plan usage — upgrade tenants hitting limits consistently
  ☐ Check AWS SES sending limits in AWS Console

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

