# Email Engine — Team & Sprint Plan
> For use when company assigns a development team.
> Each sprint = 2 weeks. Team size assumed: 4–6 developers.

---

## Recommended Team Structure

| Role | Count | Responsibilities |
|---|---|---|
| **Tech Lead** (You) | 1 | Architecture decisions, code reviews, sprint planning, client communication |
| **Backend Developer** | 1–2 | FastAPI routes, worker logic, database, SMTP, webhooks |
| **Frontend Developer** | 1–2 | Next.js pages, components, design system, UX flows |
| **DevOps / Infra** | 1 | Docker, CI/CD, AWS, SSL, Redis, Kubernetes (Phase 12) |
| **QA / Tester** | 1 | Manual + automated testing, bug reporting |

---

## Sprint Breakdown

### 🏃 Sprint 0 (Week 1–2) — Foundation & Design System
**Goal:** Everyone can run the app locally. Design system is ready. No more inline styles.

| Task | Owner | Days |
|---|---|---|
| Phase 0: Install shadcn/ui + design tokens | Frontend Dev | 2 |
| Phase 0: Build 9 reusable components (PageHeader, StatCard, etc.) | Frontend Dev | 3 |
| Phase 0: Mobile responsive layout + sidebar | Frontend Dev | 2 |
| Phase 1.5: Fix forgot/reset password with Clerk | Frontend Dev | 1 |
| Phase 1.5: Enable Google social login in Clerk dashboard | Tech Lead | 0.5 |
| Phase 1.5: Audit logs table + API | Backend Dev | 2 |
| Phase 1.5: Audit log viewer UI | Frontend Dev | 1 |
| DevOps: Set up CI/CD pipeline (GitHub Actions) | DevOps | 3 |
| DevOps: Staging environment setup | DevOps | 2 |

---

### 🏃 Sprint 1 (Week 3–4) — Template Engine Rebuild
**Goal:** Tenants can create and preview email templates using GrapesJS editor.

| Task | Owner | Days |
|---|---|---|
| Phase 3: GrapesJS editor rebuild (no MJML, store HTML) | Frontend Dev | 5 |
| Phase 3: Mobile / Desktop / Dark mode preview toggle | Frontend Dev | 2 |
| Phase 3: Send test email from editor | Frontend+Backend | 2 |
| Phase 3: Duplicate template button | Frontend Dev | 1 |
| Phase 3: Category filter tabs on template list | Frontend Dev | 1 |
| Phase 3: Template versioning (backend + version history UI) | Backend Dev | 3 |
| Phase 3: Plain text auto-generator from HTML | Backend Dev | 1 |
| Phase 3: Public "View Online" link | Backend Dev | 1 |
| QA: Test all template flows end-to-end | QA | 2 |

---

### 🏃 Sprint 2 (Week 5–6) — Campaign Enhancement
**Goal:** Campaigns feel professional — wizard, scheduling, pre-send checklist.

| Task | Owner | Days |
|---|---|---|
| Phase 4: Campaign creation wizard (step-by-step) | Frontend Dev | 3 |
| Phase 4: Schedule picker (date/time for campaigns) | Frontend Dev | 1 |
| Phase 4: Scheduled sending backend (cron trigger) | Backend Dev | 2 |
| Phase 4: Pause / Resume / Cancel campaign | Backend Dev | 2 |
| Phase 4: Pre-send checklist popup (unsubscribe link, domain, bounce rate) | Frontend Dev | 2 |
| Phase 4: Send test email modal before full send | Frontend+Backend | 1 |
| Phase 4: Resend to unopened contacts | Backend Dev | 2 |
| QA: Campaign send flow testing | QA | 2 |

---

### 🏃 Sprint 3 (Week 7–8) — Delivery Compliance
**Goal:** Every email is legally compliant. No spam. Bounces handled.

| Task | Owner | Days |
|---|---|---|
| Phase 5: Unsubscribe link auto-injected into emails | Backend Dev | 1 |
| Phase 5: Physical address auto-added to email footer | Backend Dev | 1 |
| Phase 5: Unsubscribe landing page (/unsubscribe) | Frontend Dev | 1 |
| Phase 5: Hard bounce → auto-mark contact as bounced | Backend Dev | 2 |
| Phase 5: Spam complaint → auto-unsubscribe contact | Backend Dev | 1 |
| Phase 5: Warm-up throttle (50 emails/hr for new tenants) | Backend Dev | 2 |
| Phase 5: Daily send limit per tenant | Backend Dev | 1 |
| Phase 2: Contact detail page (activity history) | Frontend Dev | 2 |
| Phase 2: Export contacts to CSV | Frontend+Backend | 1 |
| Phase 2: Suppression list page | Frontend Dev | 1 |
| QA: Full compliance testing | QA | 2 |

---

### 🏃 Sprint 4 (Week 9–10) — Analytics & Tracking
**Goal:** Tenants can see open rates, click rates, and sender health scores.

| Task | Owner | Days |
|---|---|---|
| Phase 6: Open tracking pixel endpoint | Backend Dev | 1 |
| Phase 6: Click tracking redirect endpoint | Backend Dev | 1 |
| Phase 6: Webhook ingestion (Gmail/Outlook bounces) | Backend Dev | 3 |
| Phase 6: Stats aggregation (sent/opens/clicks/bounces) | Backend Dev | 2 |
| Phase 6: Bot/scanner detection (click < 1s after open) | Backend Dev | 1 |
| Phase 6: Campaign detail page (full analytics + charts) | Frontend Dev | 4 |
| Phase 6: Dashboard Sender Health card | Frontend Dev | 2 |
| Phase 6: Contact activity tab | Frontend Dev | 1 |
| Phase 6: Export report to CSV | Frontend+Backend | 1 |
| QA: Analytics accuracy testing | QA | 2 |

---

### 🏃 Sprint 5 (Week 11–12) — Plan Enforcement + Polish
**Goal:** Plans enforced. Tenants notified. App is polished and handover-ready.

| Task | Owner | Days |
|---|---|---|
| Phase 7: Plans table (free/starter/pro) + quotas | Backend Dev | 2 |
| Phase 7: Block sends when quota exceeded | Backend Dev | 1 |
| Phase 7: Contact count limit enforcement | Backend Dev | 1 |
| Phase 7: Worker email notifications (campaign done, quota warning) | Backend Dev | 2 |
| Phase 7: Plan & Usage page (progress bars, upgrade modal) | Frontend Dev | 2 |
| Phase 7: In-app quota warning banners | Frontend Dev | 1 |
| Phase 7.5: SMTP Config settings page | Frontend+Backend | 2 |
| Phase 7.5: Domain Verification page | Frontend+Backend | 2 |
| Phase 7.5: Worker locked_by + external_msg_id (DB migration) | Backend Dev | 1 |
| Phase 7.5: API rate limiting | Backend Dev | 1 |
| QA: Full end-to-end regression testing | QA | 3 |
| Tech Lead: Handover documentation | Tech Lead | 2 |

---

## Post-Handover Sprints (Company Funds These)

### Sprint 6–7 (Phase 8) — Admin Panel
- Super admin dashboard
- Tenant management (change plan, suspend, view usage)
- Revenue overview

### Sprint 8–9 (Phase 9) — Payments
- Stripe/Razorpay integration
- Automatic plan upgrades on payment
- Invoice generation + billing history

### Sprint 10–11 (Phase 10) — Advanced Campaigns
- A/B testing
- Drip campaigns / email sequences
- Automation triggers

### Sprint 12–13 (Phase 11) — API & Integrations
- API keys for tenants
- Transactional email API
- Webhook output + Zapier integration

### Sprint 14+ (Phase 12) — Scale
- Redis queue
- Microservices migration
- Kubernetes
- IP warmup automation

---

## How to Run Sprints (Simple Process)

```
Monday (Sprint Start):
  → Tech Lead runs 30-min planning meeting
  → Assign tasks from this plan to each developer
  → Everyone picks tasks from the sprint table above

Daily (Standup - 15 min):
  → What did I do yesterday?
  → What will I do today?
  → Any blockers?

Friday (Sprint End):
  → QA tests completed features
  → Tech Lead reviews PRs (pull requests)
  → Deploy to staging for client to review
  → Plan next sprint tasks
```

---

## Tools the Team Needs

| Tool | Purpose | Cost |
|---|---|---|
| **GitHub** | Code + pull requests | Free |
| **GitHub Actions** | CI/CD auto-deploy | Free |
| **Linear / Jira** | Sprint task tracking | Free tier |
| **Figma** | UI design mockups | Free tier |
| **Slack** | Team communication | Free tier |
| **Postman** | API testing | Free |
| **Supabase Dashboard** | DB management | Already have |
| **AWS Console** | SES + monitoring | Pay-as-you-go |

---

## Key Metrics for Tech Lead to Track

| Metric | Target | Why |
|---|---|---|
| Sprint velocity | 80% tasks completed per sprint | Team efficiency |
| Bug rate | < 5 bugs per sprint | Code quality |
| API response time | < 200ms | Performance |
| Email delivery rate | > 97% | Deliverability |
| Bounce rate | < 2% | Reputation |
| Uptime | > 99.5% | Reliability |
