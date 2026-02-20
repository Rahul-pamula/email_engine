# Docker Infrastructure

This folder contains all configuration files needed to run the Email Engine in containers.

## Folder Structure

```
deploy/
├── api/
│   └── Dockerfile          # FastAPI backend container
├── client/
│   └── Dockerfile          # Next.js frontend container (multi-stage build)
├── worker/
│   └── Dockerfile          # Background email worker container
└── nginx/
    └── nginx.conf          # Reverse proxy config (for production)
```

## How to Run (Docker Compose)

From the **project root**, run:

```bash
# Start all services (first time - builds images)
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api      # API logs
docker-compose logs -f worker   # Worker logs
docker-compose logs -f client   # Frontend logs
```

## Services at a Glance

| Service | URL | Description |
|---|---|---|
| `api` | http://localhost:8000 | FastAPI REST backend |
| `api` | http://localhost:8000/docs | Swagger docs |
| `client` | http://localhost:3000 | Next.js frontend |
| `worker` | — | Background email sender |

## Production Upgrade (Nginx)

Uncomment the `nginx` service in `docker-compose.yml` to route everything through port 80.

## Scaling Upgrade (Redis)

When the company is ready to scale, add the `redis` service in `docker-compose.yml` (pre-written, commented out).
