import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="min-h-screen bg-background-primary flex items-center justify-center p-md">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-lg border border-border-default">
        <h1 class="text-2xl font-bold text-text-primary mb-lg text-center">
          Node.js API Portal
        </h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-md">
          <div>
            <label for="email" class="block text-label text-text-primary mb-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@example.com"
            />
            @if (form.get('email')?.touched && form.get('email')?.invalid) {
              <p class="text-sm text-danger mt-xs">
                @if (form.get('email')?.errors?.['required']) {
                  Email is required
                } @else if (form.get('email')?.errors?.['email']) {
                  Please enter a valid email
                }
              </p>
            }
          </div>

          <div>
            <label for="password" class="block text-label text-text-primary mb-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <p class="text-sm text-danger mt-xs">
                Password is required
              </p>
            }
          </div>

          @if (errorMessage()) {
            <div class="bg-red-50 border border-danger text-danger px-md py-sm rounded-md text-sm">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="form.invalid || isLoading()"
            class="w-full bg-primary text-white px-md py-sm rounded-md font-semibold hover:bg-primary-light disabled:bg-border-light disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="mt-lg text-center">
          <p class="text-text-secondary mb-md">
            Don't have an account?
            <a
              (click)="switchToSignup()"
              class="text-primary font-semibold cursor-pointer hover:text-primary-light"
            >
              Sign up
            </a>
          </p>
        </div>

        <div class="mt-lg p-md bg-blue-50 rounded-md">
          <p class="text-xs text-text-secondary mb-sm">
            <!-- MOCK: prefilled with the demo admin login — remove before wiring a real backend. -->
          </p>
          <p class="text-xs font-mono">
            <strong>Demo credentials:</strong><br />
            Email: admin&#64;example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly form: FormGroup = this.fb.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required]],
  });

  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (success: boolean) => {
        this.isLoading.set(false);
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Invalid email or password');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An error occurred. Please try again.');
      },
    });
  }

  switchToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
