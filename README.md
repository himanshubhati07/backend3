# nodjs angular

A complete Angular frontend for a Node.js REST API management portal. Features user authentication, role-based access control (RBAC), user and resource management, health monitoring, API documentation viewer, and audit logging.

## Tech stack

Angular (standalone components) + TypeScript, Tailwind CSS.

## Getting started

```
npm install --legacy-peer-deps
npm start
```

Then open http://localhost:56951

## Environment variables

Angular does not read .env files directly — see .env.example, which documents the value; copy it into src/environments/environment.ts's apiUrl field. Every entity runs on local mock data (readonly USE_MOCK = true in each <entity>-store.service.ts) until that's set and each entity's flag is flipped to false.

## Project structure

- **pages** — All screen components (Login, Signup, Dashboard, Users, Resources, Health, API Docs, Audit, NotFound)
- **components** — Shared UI components (Sidebar, TopBar, ToastContainer)
- **layout** — Shell component for authenticated layout wrapper
- **services** — Authentication, data stores (User, Resource), health, audit, API docs, toast notifications, HTTP interceptor
- **guards** — Auth guard for route protection
- **types** — TypeScript type definitions for all entities
- **data** — Mock data seeded into localStorage for local development
- **environments** — Environment configuration with API URL placeholder

## Backend

A Node.js/Express/PostgreSQL API lives in `backend/` (JWT auth, RBAC, Swagger docs, Jest/Supertest tests). See `backend/README.md` for installation, configuration, development and production steps.
