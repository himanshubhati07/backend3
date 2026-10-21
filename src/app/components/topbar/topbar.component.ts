import { Component, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="bg-white border-b border-border-default px-lg py-md">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-text-primary">
            Welcome, {{ currentUser()?.name || 'User' }}
          </h2>
          <p class="text-sm text-text-secondary">
            Role: <span class="font-semibold capitalize">{{ currentUser()?.role }}</span>
          </p>
        </div>
        <div class="text-sm text-text-secondary">
          {{ currentDateTime }}
        </div>
      </div>
    </header>
  `,
})
export class TopBarComponent {
  private auth = inject(AuthService);

  readonly currentUser = () => this.auth.currentUser();
  readonly currentDateTime = new Date().toLocaleString();
}
