# project-backend

Express + TypeScript REST API backed by PostgreSQL. Provides JWT authentication (short-lived access tokens, rotating refresh tokens with reuse detection), role-based access control (`admin`, `user`), CRUD for users and resources, an admin audit log, health checks and OpenAPI docs. It matches the entities used by the Angular frontend in the parent folder (users, resources, audit logs, health).

## Stack

Node.js >= 18, Express 4, TypeScript, PostgreSQL (`pg`), zod validation, bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit, pino logging, swagger-ui-express, Jest + Supertest (+ pg-mem for in-memory DB tests).

## Folder structure

```
src/
  config/       env (zod-validated), db pool + transactions, logger
  db/           migrations.ts, migrate.ts (runner), seed.ts (first admin)
  middleware/   auth (JWT + RBAC), validate, error-handler, rate-limit
  schemas/      zod request schemas
  routes/       route definitions
  controllers/  HTTP layer
  services/     business logic + SQL (auth, user, resource, audit, health)
  utils/        tokens, password, pagination, sanitize, errors, api-response
  docs/         OpenAPI spec
tests/          unit/ and integration/ (Jest + Supertest)
```

## Installation and configuration

```
cd backend
npm install
cp .env.example .env     # then fill in DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
```

Generate secrets with e.g. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. All configuration comes from environment variables (see `.env.example`); nothing secret is stored in code.

## Development

```
npm run migrate     # apply schema migrations (also run automatically on start)
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='Str0ngPass1' npm run seed   # create first admin
npm run dev         # watch mode on http://localhost:3000
npm test            # unit + integration tests
npm run typecheck
```

Public registration always creates the `user` role; admins are created via the seed script or `POST /api/v1/users` by an existing admin.

## Production

```
npm ci
npm run build
NODE_ENV=production npm run migrate:prod
NODE_ENV=production npm start
```

Deployment notes:
- Provide `DATABASE_URL`, `JWT_*` secrets and `CORS_ORIGINS` (the deployed frontend origin) via your platform's secret store.
- Run behind a TLS-terminating proxy (the app trusts one proxy hop for client IPs / rate limiting).
- Use `GET /api/v1/health` (readiness, returns 503 if the DB is down) and `GET /api/v1/health/live` (liveness) for probes.
- The server handles SIGTERM/SIGINT by draining connections and closing the DB pool.
- Point the Angular app at the API by setting `apiUrl` in `src/environments/environment.ts` and flipping `USE_MOCK` to `false` in the frontend services (the frontend's expected paths are under `/api/v1`).

## API

Interactive docs: `http://localhost:3000/api-docs` (raw JSON at `/api-docs.json`).

| Area | Endpoints |
|------|-----------|
| Auth | `POST /api/v1/auth/register`, `/login`, `/refresh`, `/logout`; `GET /auth/me` |
| Users (admin; self for get/update) | `GET/POST /users`, `GET/PATCH/DELETE /users/:id` |
| Resources (own; admin sees all) | `GET/POST /resources`, `GET/PATCH/DELETE /resources/:id` |
| Audit (admin) | `GET /audit` |
| Health | `GET /health`, `GET /health/live` |

List endpoints accept `page`, `limit` (max 100), `search`, `sortBy`, `order` plus entity filters.

Responses: `{ "success": true, "message": "...", "data": {} }` or `{ "success": false, "message": "...", "errors": [] }` with status codes 200/201/400/401/403/404/409/429/500/503.

## Security

Parameterized SQL only, whitelisted sort columns, zod validation + text sanitization, bcrypt hashing, hashed refresh tokens at rest, helmet headers, CORS allow-list, global and stricter auth rate limits, no stack traces or secrets in responses, login timing equalization.

## Known limitations

Tests run against pg-mem (in-memory PostgreSQL emulation), not a real PostgreSQL server; run the migrations against a real database before first deploy. The Angular frontend still defaults to mock data until `USE_MOCK` is flipped and its request/response shapes are verified against this API.
