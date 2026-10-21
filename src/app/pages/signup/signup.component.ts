import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="min-h-screen bg-background-primary flex items-center justify-center p-md">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-lg border border-border-default">
        <h1 class="text-2xl font-bold text-text-primary mb-lg text-center">
          Create Account
        </h1>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-md">
          <div>
            <label for="name" class="block text-label text-text-primary mb-sm">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
            @if (form.get('name')?.touched && form.get('name')?.invalid) {
              <p class="text-sm text-danger mt-xs">Name is required</p>
            }
          </div>

          <div>
            <label for="email" class="block text-label text-text-primary mb-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="john@example.com"
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
            <p class="text-xs text-text-secondary mt-xs">
              At least 6 characters
            </p>
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <p class="text-sm text-danger mt-xs">
                Password must be at least 6 characters
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
            {{ isLoading() ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-lg text-center">
          <p class="text-text-secondary">
            Already have an account?
            <a
              (click)="switchToLogin()"
              class="text-primary font-semibold cursor-pointer hover:text-primary-light"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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

    const { name, email, password } = this.form.value;

    this.auth.signup(name, email, password).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Email already exists. Please login or use a different email.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('An error occurred. Please try again.');
      },
    });
  }

  switchToLogin(): void {
    this.router.navigate(['/login']);
  }
}
