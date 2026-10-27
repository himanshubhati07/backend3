# images

A professional project management and code generation dashboard built with Svelte 5. Features a lightweight dark-to-light theme conversion, project statistics tracking, and cognitive agent management.

## Tech stack

Svelte 5 + TypeScript, Vite, Tailwind CSS, svelte-routing, axios.

## Getting started

```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

Then open http://localhost:51697

## Environment variables

See .env.example. VITE_API_URL is optional — every entity runs on local mock data (USE_MOCK = true in src/data/store.ts) until it's set and each entity's flag is flipped to false.

## Project structure

- **src/pages** — Page components for each route (Home, Projects, Connections, Team, Learning, Agent, Settings, NotFound)
- **src/components** — Shared UI components (Layout, Sidebar, TopBar, Redirect)
- **src/data** — Mock data, localStorage-backed CRUD store, and data fetching gates
- **src/api** — Axios client with request/response interceptors
- **src/types** — TypeScript type definitions for all entities
