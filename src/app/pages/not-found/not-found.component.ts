import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="min-h-screen bg-background-primary flex items-center justify-center p-md">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-danger mb-md">404</h1>
        <h2 class="text-2xl font-bold text-text-primary mb-md">Page Not Found</h2>
        <p class="text-text-secondary mb-lg max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div class="flex gap-md justify-center">
          <button
            (click)="goHome()"
            class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light transition-colors"
          >
            Go Home
          </button>
          <button
            (click)="goBack()"
            class="bg-border-default text-text-primary px-lg py-sm rounded-md font-semibold hover:bg-surface-hover transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
