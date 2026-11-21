# CertiFlow

Certificate management and verification workflow application.

## Stack

- React + Vite + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL
- Prisma
- Docker

## Documentation

- [Setup Guide](SETUP_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)

## Docker Quick Start

1. Copy the project environment template or create a root `.env` file.
2. Set `POSTGRES_PASSWORD`, `JWT_SECRET`, and `VITE_API_URL`.
3. Build and start:

```bash
docker compose up --build -d
```

4. Frontend: `http://localhost:8080`
5. Backend: `http://localhost:5000`

Ensure the frontend API URL matches the backend API configuration in `frontend/src/api.ts`.
