# nodjs angular — Routes & Navigation

## How to run

```bash
cd /workspace/frontend_runs/1bcb50f0-bb69-4ca5-8b3e-ae084d208ac0/project
npm install --legacy-peer-deps && npx ng serve --port 56951
```

Then open http://localhost:56951

## Routes

| Route | Component file | Description |
|-------|----------------|-------------|
| / | redirects | Redirects to dashboard on authenticated entry |
| /login | src/app/pages/login/login.component.ts | User login form with email/password authentication and signup link |
| /signup | src/app/pages/signup/signup.component.ts | User account creation form with validation |
| /dashboard | src/app/pages/dashboard/dashboard.component.ts | Main authenticated dashboard with navigation cards (protected by authGuard) |
| /users | src/app/pages/users/users.component.ts | Admin-only user management list with CRUD actions (protected) |
| /users/create | src/app/pages/user-create/user-create.component.ts | Form to create a new user (protected, admin-only) |
| /users/:id | src/app/pages/user-detail/user-detail.component.ts | View/edit user details and delete user (protected, admin-only) |
| /resources | src/app/pages/resources/resources.component.ts | List of resources with create/view/edit/delete actions (protected) |
| /resources/create | src/app/pages/resource-create/resource-create.component.ts | Form to create a new resource (protected) |
| /resources/:id | src/app/pages/resource-detail/resource-detail.component.ts | View/edit resource details and delete resource (protected) |
| /health | src/app/pages/health/health.component.ts | System health check dashboard showing service/database/memory/CPU status (protected) |
| /api-docs | src/app/pages/api-docs/api-docs.component.ts | API endpoint documentation browser (protected) |
| /audit | src/app/pages/audit/audit.component.ts | Admin-only audit log viewer showing all system actions (protected, admin-only) |
| ** | src/app/pages/not-found/not-found.component.ts | 404 not-found fallback with home/back buttons (public) |

## Navigation map

- **Login → Dashboard** (successful authentication with standard user role)
- **Login → User Management** (successful authentication with admin role)
- **Login → Signup** (click "Sign up" link)
- **Signup → Login** (click "Login" link)
- **Signup → Dashboard** (successful account creation)
- **Dashboard → Users** (sidebar link, admin-only)
- **Dashboard → Resources** (sidebar link)
- **Dashboard → Health Check** (sidebar link, admin-only)
- **Dashboard → API Docs** (sidebar link)
- **Dashboard → Audit Logs** (sidebar link, admin-only)
- **Users → User Detail** (click user table row)
- **User Detail → User Create** (never, user create is a separate page)
- **User Detail → Users** (back button)
- **User Create → Users** (form submit)
- **Resources → Resource Detail** (click resource table row)
- **Resource Detail → Resources** (back button)
- **Resource Create → Resources** (form submit)
- **Any authenticated page → Login** (click logout button in topbar)
- **Any URL → NotFound** (unknown route)

## Shared components

- **SidebarComponent** (src/app/components/sidebar/sidebar.component.ts) — Left sidebar with navigation links filtered by current user role, includes logout button
- **TopBarComponent** (src/app/components/topbar/topbar.component.ts) — Header with welcome message, current user name/role, and current date/time
- **ToastContainerComponent** (src/app/components/toast-container/toast-container.component.ts) — Toast notification container displaying success/error/info messages with auto-dismiss
- **ShellComponent** (src/app/layout/shell/shell.component.ts) — Layout wrapper combining sidebar + topbar + router-outlet for authenticated routes

## Design tokens

### Colors

- **primary** (#0066CC) — Main action color for buttons and links
- **primary-light** (#4D94FF) — Hover state for primary buttons
- **success** (#00AA00) — Success messages and positive states
- **warning** (#FF6600) — Warning/caution messages
- **danger** (#CC0000) — Error states and destructive actions
- **background-primary** (#FFFFFF) — Main page background
- **background-secondary** (#F5F5F5) — Card and section backgrounds
- **border-default** (#CCCCCC) — Neutral borders
- **border-light** (#E8E8E8) — Disabled and muted borders
- **text-primary** (#000000) — Body text
- **text-secondary** (#666666) — Secondary and muted text
- **text-disabled** (#AAAAAA) — Disabled text
- **surface-hover** (#F0F0F0) — Hover state for surfaces

### Typography

- **Body** — 14px, 400 weight, 1.5 line-height
- **Small** — 12px, 400 weight, 1.4 line-height
- **Label** — 12px, 600 weight, 1.4 line-height
- **Heading 1** — 28px, 700 weight, 1.2 line-height
- **Heading 2** — 22px, 700 weight, 1.3 line-height
- **Heading 3** — 18px, 600 weight, 1.3 line-height
- **Monospace (code/API)** — 13px, 400 weight, Courier New
