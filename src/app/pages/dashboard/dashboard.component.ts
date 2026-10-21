import { Component, ViewEncapsulation, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div class="pb-md border-b-4 border-red-500">
        <h1 class="text-2xl font-bold text-red-600 mb-md">Dashboard</h1>
        <p class="text-text-secondary">
          Welcome to the Node.js API Management Portal. Use the sidebar to navigate to different sections.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div
          (click)="navigateTo('/resources')"
          class="p-lg bg-white rounded-lg shadow border-2 border-red-400 cursor-pointer hover:shadow-lg hover:bg-red-50 transition-all"
        >
          <div class="flex items-start gap-md">
            <div class="text-4xl">📦</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text-primary mb-sm">Resources</h3>
              <p class="text-sm text-text-secondary mb-md">
                Manage and monitor your application resources
              </p>
              <button
                type="button"
                class="text-primary font-semibold hover:text-primary-light text-sm"
              >
                View Resources →
              </button>
            </div>
          </div>
        </div>

        @if (isAdmin()) {
          <div
            (click)="navigateTo('/users')"
            class="p-lg bg-white rounded-lg shadow border-2 border-red-400 cursor-pointer hover:shadow-lg hover:bg-red-50 transition-all"
          >
            <div class="flex items-start gap-md">
              <div class="text-4xl">👥</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-text-primary mb-sm">User Management</h3>
                <p class="text-sm text-text-secondary mb-md">
                  Create and manage user accounts and roles
                </p>
                <button
                  type="button"
                  class="text-primary font-semibold hover:text-primary-light text-sm"
                >
                  Manage Users →
                </button>
              </div>
            </div>
          </div>
        }

        <div
          (click)="navigateTo('/health')"
          class="p-lg bg-white rounded-lg shadow border-2 border-red-400 cursor-pointer hover:shadow-lg hover:bg-red-50 transition-all"
        >
          <div class="flex items-start gap-md">
            <div class="text-4xl">❤️</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text-primary mb-sm">Health Check</h3>
              <p class="text-sm text-text-secondary mb-md">
                Monitor system status and metrics
              </p>
              <button
                type="button"
                class="text-primary font-semibold hover:text-primary-light text-sm"
              >
                View Status →
              </button>
            </div>
          </div>
        </div>

        <div
          (click)="navigateTo('/api-docs')"
          class="p-lg bg-white rounded-lg shadow border-2 border-red-400 cursor-pointer hover:shadow-lg hover:bg-red-50 transition-all"
        >
          <div class="flex items-start gap-md">
            <div class="text-4xl">📚</div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text-primary mb-sm">API Documentation</h3>
              <p class="text-sm text-text-secondary mb-md">
                Browse available API endpoints and schemas
              </p>
              <button
                type="button"
                class="text-primary font-semibold hover:text-primary-light text-sm"
              >
                View Docs →
              </button>
            </div>
          </div>
        </div>

        @if (isAdmin()) {
          <div
            (click)="navigateTo('/audit')"
            class="p-lg bg-white rounded-lg shadow border-2 border-red-400 cursor-pointer hover:shadow-lg hover:bg-red-50 transition-all"
          >
            <div class="flex items-start gap-md">
              <div class="text-4xl">📋</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-text-primary mb-sm">Audit Logs</h3>
                <p class="text-sm text-text-secondary mb-md">
                  View system activity and security events
                </p>
                <button
                  type="button"
                  class="text-primary font-semibold hover:text-primary-light text-sm"
                >
                  View Logs →
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  readonly isAdmin = () => this.auth.currentRole() === 'admin';

  ngOnInit(): void {
    // Ensure user is authenticated
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
