# 📧 Email Engine

A multi-tenant email marketing platform — built for businesses to manage contacts, create email templates, run campaigns, and track delivery analytics.

> **Status:** Active Development — MVP ready for internal testing.

---

## What It Does

| Feature | Status |
|---|---|
| Multi-tenant auth (Clerk + RLS) | ✅ Live |
| Contact management (CSV import, segments) | ✅ Live |
| Email templates (35+ presets) | ✅ Live |
| Campaign creation + send | ✅ Live |
| Background email delivery (SMTP) | ✅ Live |
| Open/click tracking | 🔧 In progress |
| Plan enforcement + quotas | 📋 Planned |
| Stripe payments | 📋 Planned |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend API** | FastAPI (Python) |
| **Email Worker** | Python background service |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Auth** | Clerk (JWT, multi-tenant) |
| **Email Sending** | Amazon SES (SMTP) |
| **Storage** | Supabase Storage (images, assets) |
| **Containerization** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Nginx                       │
│  /api/* → FastAPI    /* → Next.js            │
└───────────────┬──────────────────────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
┌────▼─────┐        ┌──────▼──────┐
│ FastAPI  │        │  Next.js    │
│ :8000    │        │  :3000      │
└────┬─────┘        └─────────────┘
     │
     │   (writes tasks to email_tasks table)
     │
┌────▼──────────┐        ┌─────────────────┐
│  Email Worker │        │   Supabase DB   │
│  (Python)     │◄──────►│   (PostgreSQL)  │
│  Polls DB     │        │   + RLS         │
└───────────────┘        └─────────────────┘
                                │
                         ┌──────▼──────┐
                         │ Amazon SES  │
                         │ (SMTP send) │
                         └─────────────┘
```

---

## Project Structure

```
email_engine/
├── platform/
│   ├── api/              # FastAPI backend
│   │   ├── main.py       # App entry point + routes
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── utils/        # JWT, middleware, helpers
│   │   └── requirements.txt
│   ├── client/           # Next.js frontend
│   │   └── src/app/      # Pages + components
│   └── services/
│       └── worker.py     # Background email delivery worker
├── deploy/               # Docker configurations
│   ├── api/Dockerfile
│   ├── worker/Dockerfile
│   ├── client/Dockerfile
│   └── nginx/nginx.conf
├── docs/                 # Project documentation
│   ├── phase_wise_plan   # Complete feature roadmap
│   └── team_sprint_plan.md  # Team structure + sprint plan
├── scripts/              # DB migration + seeding scripts
├── tests/
│   └── fixtures/         # Test data files
├── docker-compose.yml    # Orchestrate all services
├── start.sh              # Local development startup
└── stop.sh               # Local development shutdown
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- A `.env` file with credentials (see below)

### 1. Clone and configure
```bash
git clone <repo-url>
cd email_engine
cp .env.example .env
# Edit .env with your credentials
```

### 2. Install dependencies
```bash
# Backend
cd platform/api
# Create a virtual environment named .venv
python -m venv .venv

# Activate it (on Mac/Linux)
source .venv/bin/activate

# Activate it (on Windows)
.venv\Scripts\activate

pip install -r requirements.txt

# Make sure your virtual environment is activated if you used one
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd email_engine/platform/client
npm install
npm run dev

### 3. Start everything
```bash
./start.sh
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### 4. Stop everything
```bash
./stop.sh
```

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk Auth
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# SMTP (Amazon SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-user
SMTP_PASS=your-ses-smtp-password
SMTP_FROM=noreply@yourdomain.com

# App
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Docker Deployment

### Run with Docker (recommended for production):
```bash
docker-compose up --build
```

### Run in background:
```bash
docker-compose up -d --build
```

### View logs:
```bash
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f client
```

### Stop:
```bash
docker-compose down
```

> See `deploy/README.md` for full Docker setup and SMTP configuration.

---

## Viewing Logs (Local Dev)

```bash
tail -f logs/api.log       # API logs
tail -f logs/worker.log    # Worker logs
tail -f logs/frontend.log  # Frontend logs
tail -f logs/*.log         # All at once
```

---

## Database

- Hosted on **Supabase** (PostgreSQL)
- Row Level Security (RLS) enforced — tenants can only access their own data
- Migrations in `scripts/` folder

```bash
# Run a migration
./scripts/run_migration.sh
```

---

## How Email Sending Works

```
1. Tenant creates a Campaign
2. Clicks "Send" → API snapshots HTML + recipients → inserts email_tasks rows
3. Background Worker polls email_tasks every 5 seconds
4. Worker sends each email via Amazon SES SMTP
5. On failure: retries up to 3 times with backoff
6. On hard failure: moves to email_tasks_dead (dead-letter queue)
7. Status updated in real-time: draft → processing → completed
```

---

## Roadmap

Full roadmap is in `docs/phase_wise_plan`.

**Before Handover (Phases 0–7):**
- Phase 0 → UI/UX Design system (shadcn/ui)
- Phase 1.5 → Auth cleanup + Google login
- Phase 3 → Template editor rebuild (GrapesJS)
- Phase 4 → Campaign wizard + scheduling
- Phase 5 → Compliance (unsubscribe, bounce handling)
- Phase 6 → Analytics (open/click tracking, reports)
- Phase 7 → Plan enforcement (free/starter/pro quotas)

**Post-Handover (Phases 8–12, company funds):**
- Phase 8 → Admin panel
- Phase 9 → Stripe/Razorpay payments
- Phase 10 → A/B testing, drip campaigns
- Phase 11 → API & integrations
- Phase 12 → Redis, microservices, Kubernetes

---

## Team Structure

See `docs/team_sprint_plan.md` for full sprint breakdown and role assignments.

| Role | Responsibility |
|---|---|
| Tech Lead | Architecture, reviews, client comms |
| Backend Dev | FastAPI, worker, DB |
| Frontend Dev | Next.js, components, UX |
| DevOps | Docker, CI/CD, AWS |
| QA | Testing, bug reports |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port already in use | `lsof -ti:8000 \| xargs kill -9` |
| Services won't start | Check `logs/` directory |
| DB connection error | Verify `SUPABASE_URL` in `.env` |
| SMTP error | Verify SES keys + domain verified in AWS |
| Reset everything | `./stop.sh && rm -rf logs/ && ./start.sh` |

---

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes + write tests
3. Open a Pull Request → Tech Lead reviews
4. Merge after approval + CI passes

---

*Built with ❤️ — Email Engine v1.0*
