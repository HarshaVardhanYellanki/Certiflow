# CertiFlow Deployment Guide

## 1. Deployment Architecture

The recommended container architecture is:

```text
Browser
   |
   v
Frontend Container (Nginx serving React/Vite build)
   |
   v
Backend Container (Node.js + Express API)
   |
   v
PostgreSQL Database
```

For production, use a managed PostgreSQL service where possible, keep secrets outside source control, and expose HTTPS through a reverse proxy/load balancer.

## 2. Before Deployment

- Confirm the frontend production build succeeds.
- Confirm the backend TypeScript build succeeds.
- Confirm Prisma migrations are committed.
- Confirm all production environment variables are available.
- Remove demo credentials or change their passwords.
- Never commit `.env` files.

## 3. Environment Variables

Backend variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<production-postgresql-connection-string>
JWT_SECRET=<long-random-secret>
```

Frontend build variable:

```env
VITE_API_URL=<public-api-base-url>
```

The exact frontend variable must match the variable used in `frontend/src/api.ts`.

## 4. Docker Compose Deployment

From the repository root:

```bash
docker compose up --build -d
```

Check container status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## 5. Database Migrations

Run Prisma migrations against the production database before or during deployment using the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

Do not use `prisma migrate dev` against a production database.

## 6. Updating the Application

After pulling the latest code:

```bash
git pull
docker compose up --build -d
```

Then apply migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

## 7. AWS Deployment Option

A typical AWS deployment can use:

- Amazon ECR: store Docker images
- Amazon ECS: run frontend and backend containers
- Amazon RDS PostgreSQL: managed database
- Application Load Balancer: HTTPS and routing
- AWS Secrets Manager: database credentials and JWT secret
- CloudWatch: logs and monitoring

High-level deployment flow:

1. Build Docker images.
2. Authenticate Docker to ECR.
3. Push backend and frontend images to ECR.
4. Create/update ECS task definitions.
5. Deploy services to ECS.
6. Configure RDS and security groups.
7. Configure the Application Load Balancer.
8. Run Prisma migrations.
9. Configure HTTPS and DNS.
10. Verify login, batch workflow, approvals, certificate issuance, and public verification.

## 8. Production Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] Production database credentials stored in a secret manager
- [ ] Database not publicly accessible unless required
- [ ] CORS restricted to approved frontend origins
- [ ] Demo accounts disabled or passwords changed
- [ ] Rate limiting configured for authentication and public verification
- [ ] Input validation enabled on backend endpoints
- [ ] Authorization enforced on every protected endpoint
- [ ] Database backups configured
- [ ] Logs do not contain passwords, tokens, or sensitive candidate data
- [ ] Certificate cancellation immediately affects verification results
- [ ] Container images use non-root users where practical

## 9. Operational Commands

```bash
# Start

docker compose up -d

# Stop

docker compose down

# Rebuild

docker compose up --build -d

# Logs

docker compose logs -f

# Container status

docker compose ps
```

## 10. Important Production Notes

The Docker configuration provided with this guide is a starting point. Before production use, verify:

- The backend entry point matches the compiled application.
- The backend package scripts are correct.
- The frontend API URL is configured correctly.
- Prisma migrations are applied.
- Persistent storage and database backup policies are configured.
- The application has been tested with production-like data and concurrency.
