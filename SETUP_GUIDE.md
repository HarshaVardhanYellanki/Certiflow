# CertiFlow Setup Guide

## 1. Project Overview

CertiFlow is a certificate-management workflow application with role-based access:

- Training Centre: create batches, upload candidate CSV data, and submit batches.
- District Officer: district-level batch approval.
- Quality Officer: quality review and approval.
- State Officer: final approval and certificate issuance/cancellation.
- Public verification: verify certificates using a certificate number or verification code.

## 2. Technology Stack

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Containerization: Docker and Docker Compose

## 3. Prerequisites

Install:

- Git
- Node.js (use the version specified in the project, if present)
- npm
- Docker Desktop (Windows/macOS) or Docker Engine + Docker Compose (Linux)

## 4. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd CertiFlow
```

## 5. Configure Backend Environment

Create `backend/.env` using `backend/.env.example` if available. Otherwise, configure the variables required by the backend:

```env
PORT=5000
DATABASE_URL="postgresql://certiflow:certiflow_password@localhost:5432/certiflow?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
```

Do not commit real secrets or production environment files.

## 6. Start PostgreSQL

### Option A: Docker

From the project root:

```bash
docker compose up -d postgres
```

### Option B: Local PostgreSQL

Create a database named `certiflow` and update `DATABASE_URL` in `backend/.env`.

## 7. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
```

If the project has a seed script configured:

```bash
npx prisma db seed
```

Start the development server using the script defined in `backend/package.json`, commonly:

```bash
npm run dev
```

## 8. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Configure the API base URL in the frontend environment file according to the project's `api.ts` implementation. For example, if the backend exposes API routes under `/api`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

## 9. Demo Accounts

If the project's seed script creates these demo accounts, they can be used for testing:

| Role | Email | Password |
|---|---|---|
| Training Centre | `anika@certiflow.demo` | `CertiFlow@123` |
| District Officer | `dev@certiflow.demo` | `CertiFlow@123` |
| District Officer | `meera@certiflow.demo` | `CertiFlow@123` |
| District Officer | `kabir@certiflow.demo` | `CertiFlow@123` |
| Quality Officer | `neha@certiflow.demo` | `CertiFlow@123` |
| State Officer | `farah@certiflow.demo` | `CertiFlow@123` |

These are demo credentials only. Change or remove them before production deployment.

## 10. Main Workflow

1. Training Centre creates a batch.
2. Training Centre uploads candidate CSV data.
3. CSV validation is performed before import.
4. Training Centre submits the batch.
5. District Officer approves.
6. Quality Officer approves.
7. State Officer gives final approval.
8. Certificates are issued for the approved batch.
9. Certificates can be verified using their certificate number or verification code.
10. State Officer can cancel a batch according to the implemented cancellation policy.

## 11. CSV Format

Use the headers expected by the application:

```csv
name,email,phone,registrationNumber,courseName,completionDate
Harsha,harsha@example.com,9876543210,REG001,AI Fundamentals,2026-11-20
```

Check the frontend and backend validation for the exact required/optional fields and date format.

## 12. Troubleshooting

### Database connection error

- Ensure PostgreSQL is running.
- Check `DATABASE_URL`.
- Ensure the database exists.

### Prisma client error

```bash
npx prisma generate
```

### Migration error

For local development, inspect the migration and database state before resetting anything. Avoid destructive reset commands if data must be retained.

### Frontend cannot connect to backend

- Verify the backend is running.
- Verify the frontend API base URL.
- Verify backend CORS configuration.
- Check browser developer tools for the failed request.

### Docker commands

```bash
docker compose up --build
docker compose down
docker compose logs -f
docker compose ps
```
