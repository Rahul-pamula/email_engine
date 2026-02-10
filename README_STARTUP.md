# Email Engine - Startup Guide

## Quick Start

### 1. Start All Services
```bash
./start.sh
```

This will automatically start:
- ✅ Backend API (FastAPI) on http://localhost:8000
- ✅ Worker Service (Background jobs)
- ✅ Frontend (Next.js) on http://localhost:3000

### 2. Stop All Services
```bash
./stop.sh
```

---

## What the Start Script Does

1. **Environment Check**: Verifies `.env` file exists
2. **Port Cleanup**: Kills any processes on ports 8000 and 3000
3. **Backend API**: Starts FastAPI with auto-reload
4. **Worker Service**: Starts background email worker
5. **Frontend**: Starts Next.js development server
6. **Health Checks**: Waits for services to be ready
7. **Logging**: Creates log files in `logs/` directory

---

## Accessing Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API documentation |

---

## Viewing Logs

### Real-time logs:
```bash
# API logs
tail -f logs/api.log

# Worker logs
tail -f logs/worker.log

# Frontend logs
tail -f logs/frontend.log
```

### All logs at once:
```bash
tail -f logs/*.log
```

---

## Manual Start (Alternative)

If you prefer to start services individually:

### Terminal 1 - Backend API
```bash
cd platform/api
uvicorn main:app --reload
```

### Terminal 2 - Worker
```bash
cd platform/services
python worker.py
```

### Terminal 3 - Frontend
```bash
cd platform/client
npm run dev
```

---

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Kill process on port 8000 (API)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Services Won't Start
1. Check logs in `logs/` directory
2. Ensure `.env` file exists and is configured
3. Verify Python and Node.js are installed
4. Check database connection in `.env`

### Reset Everything
```bash
./stop.sh
rm -rf logs/
./start.sh
```

---

## First Time Setup

Before running `./start.sh` for the first time:

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your credentials**:
   - Supabase URL and key
   - JWT secret
   - Other API keys

3. **Install dependencies**:
   ```bash
   # Backend
   cd platform/api
   pip install -r requirements.txt
   
   # Frontend
   cd ../client
   npm install
   ```

4. **Run migrations** (if needed):
   ```bash
   # Apply database migrations
   psql -h your-supabase-host -U postgres -d postgres -f platform/database/migrations/002_progressive_onboarding.sql
   ```

5. **Start the platform**:
   ```bash
   ./start.sh
   ```

---

## Default Credentials

After signup, you can create your first account at:
- http://localhost:3000/signup

---

## Production Deployment

For production, use:
```bash
# Build frontend
cd platform/client
npm run build

# Start with PM2 or similar process manager
pm2 start ecosystem.config.js
```

---

## Support

- Check logs first: `logs/api.log`, `logs/worker.log`, `logs/frontend.log`
- Review `.env` configuration
- Ensure all dependencies are installed
- Verify database connection

Happy coding! 🚀
