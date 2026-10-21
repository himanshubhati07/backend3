import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'users/create',
        loadComponent: () =>
          import('./pages/user-create/user-create.component').then(m => m.UserCreateComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/resources/resources.component').then(m => m.ResourcesComponent),
      },
      {
        path: 'resources/create',
        loadComponent: () =>
          import('./pages/resource-create/resource-create.component').then(
            m => m.ResourceCreateComponent
          ),
      },
      {
        path: 'resources/:id',
        loadComponent: () =>
          import('./pages/resource-detail/resource-detail.component').then(
            m => m.ResourceDetailComponent
          ),
      },
      {
        path: 'health',
        loadComponent: () =>
          import('./pages/health/health.component').then(m => m.HealthComponent),
      },
      {
        path: 'api-docs',
        loadComponent: () =>
          import('./pages/api-docs/api-docs.component').then(m => m.ApiDocsComponent),
      },
      {
        path: 'audit',
        loadComponent: () => import('./pages/audit/audit.component').then(m => m.AuditComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
