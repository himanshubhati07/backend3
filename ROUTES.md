# images — Routes & Navigation

## How to run

```
cd /workspace/frontend_runs/17a692eb-98e6-4bec-b887-d59f2d534988/project
npm install --legacy-peer-deps && npm run dev
```

Then open http://localhost:51697

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | src/components/Redirect.svelte | Redirects to /home |
| /home | src/pages/Home.svelte | Main dashboard: Frontend Agent project overview with stats, tabs, and project creation form |
| /projects | src/pages/Projects.svelte | Projects list view with status indicators |
| /connections | src/pages/Connections.svelte | Connections and integrations management |
| /team | src/pages/Team.svelte | Team members and access control |
| /learning | src/pages/Learning.svelte | Learning resources and documentation |
| /agent/:id | src/pages/Agent.svelte | Individual agent detail page (Backend Agent, Frontend Agent, IntegrationX) |
| /settings | src/pages/Settings.svelte | Application settings |
| * | src/pages/NotFound.svelte | 404 page with link to home |

## Navigation map

- Home → Projects (sidebar link)
- Home → Connections (sidebar link)
- Home → Team & Access (sidebar link, with notification badge)
- Home → Harness Learning (sidebar link)
- Home → Agent Detail (click cognitive suite agents: Backend Agent, Frontend Agent, IntegrationX)
- Home → Settings (sidebar link)
- Home → Projects (New Project or Existing Project buttons)
- All dashboard pages → Home (Home sidebar link)
- All dashboard pages → Back button (history.back())
- Any page → NotFound (unknown URL)

## Shared components

- **Layout.svelte** — Main shell wrapping dashboard pages with sidebar and top bar
- **Sidebar.svelte** — Left navigation with main nav items and cognitive suite agents; uses @lucide/svelte icons
- **TopBar.svelte** — Header with search bar, theme toggle, notifications, and user avatar
- **Redirect.svelte** — Programmatic navigation helper for route redirects

## Design tokens

Custom Tailwind colors defined in tailwind.config.js:

| Token | Value | Usage |
|-------|-------|-------|
| primary | #3B82F6 | Buttons, active states, links |
| secondary | #0EA5E9 | Cyan accents |
| accent | #06B6D4 | Teal highlight |
| surface | #F3F4F6 | Sidebar and card backgrounds |
| background | #F5F7FA | Page background |
| foreground | #FFFFFF | Content/card foreground |
| text | #1F2937 | Primary text color |
| textSecondary | #6B7280 | Secondary text color |
| textMuted | #9CA3AF | Disabled/muted text |
| border | #E5E7EB | Borders |
| success | #10B981 | Green status/success indicator |
| warning | #F59E0B | Amber/yellow status |
| danger | #EF4444 | Red error/critical indicator |
| info | #3B82F6 | Blue informational indicator |
