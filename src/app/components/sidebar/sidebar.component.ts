import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  to: string;
  roles: ('admin' | 'user')[];
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside class="w-64 bg-background-secondary border-r border-border-default min-h-screen flex flex-col">
      <div class="p-lg border-b border-border-default">
        <h1 class="text-2xl font-bold text-primary">Node.js API</h1>
      </div>

      <nav class="flex-1 p-md">
        <ul class="space-y-sm">
          @for (item of navItems; track item.to) {
            @if (currentRole() && item.roles.includes(currentRole()!)) {
              <li>
                <a
                  [routerLink]="item.to"
                  routerLinkActive="bg-primary text-white"
                  [routerLinkActiveOptions]="{ exact: false }"
                  class="flex items-center gap-md px-md py-sm rounded-md text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <span class="text-lg">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            }
          }
        </ul>
      </nav>

      <div class="p-md border-t border-border-default">
        <button
          (click)="onLogout()"
          class="w-full px-md py-sm bg-danger text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly currentRole = signal<'admin' | 'user' | null>(null);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', roles: ['admin', 'user'], icon: '📊' },
    { label: 'Resources', to: '/resources', roles: ['admin', 'user'], icon: '📦' },
    { label: 'Users', to: '/users', roles: ['admin'], icon: '👥' },
    { label: 'Health Check', to: '/health', roles: ['admin', 'user'], icon: '❤️' },
    { label: 'API Docs', to: '/api-docs', roles: ['admin', 'user'], icon: '📚' },
    { label: 'Audit Logs', to: '/audit', roles: ['admin'], icon: '📋' },
  ];

  constructor() {
    this.currentRole.set(this.auth.currentRole());
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
