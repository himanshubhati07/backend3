import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg max-w-2xl">
      <div class="flex items-center gap-md">
        <button
          (click)="location.back()"
          class="text-primary font-semibold hover:text-primary-light"
        >
          ← Back
        </button>
        <h1 class="text-2xl font-bold text-text-primary">Create New User</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-lg border border-border-default">
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
                } @else {
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
            <p class="text-xs text-text-secondary mt-xs">At least 6 characters</p>
            @if (form.get('password')?.touched && form.get('password')?.invalid) {
              <p class="text-sm text-danger mt-xs">
                Password must be at least 6 characters
              </p>
            }
          </div>

          <div>
            <label for="role" class="block text-label text-text-primary mb-sm">
              Role
            </label>
            <select
              id="role"
              formControlName="role"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex gap-md pt-md">
            <button
              type="submit"
              [disabled]="form.invalid || isSaving()"
              class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light disabled:bg-border-light disabled:cursor-not-allowed transition-colors"
            >
              {{ isSaving() ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UserCreateComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userStore = inject(UserStoreService);
  readonly location = inject(Location);

  readonly isSaving = signal(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const { name, email, password, role } = this.form.value;

    this.userStore
      .create({
        name,
        email,
        password,
        role,
        status: 'active',
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/users']);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }
}
