import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserStoreService } from '../../services/user-store.service';
import { User } from '../../types';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isLoading()) {
      <div class="text-center py-2xl">
        <p class="text-text-secondary">Loading user...</p>
      </div>
    } @else if (user()) {
      <div class="space-y-lg">
        <div class="flex items-center gap-md">
          <button
            (click)="location.back()"
            class="text-primary font-semibold hover:text-primary-light"
          >
            ← Back
          </button>
          <h1 class="text-2xl font-bold text-text-primary">{{ user()?.name }}</h1>
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
              />
            </div>

            <div>
              <label for="email" class="block text-label text-text-primary mb-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
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

            <div>
              <label for="status" class="block text-label text-text-primary mb-sm">
                Status
              </label>
              <select
                id="status"
                formControlName="status"
                class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="flex gap-md pt-md">
              <button
                type="submit"
                [disabled]="form.invalid || isSaving()"
                class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light disabled:bg-border-light disabled:cursor-not-allowed transition-colors"
              >
                {{ isSaving() ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                (click)="onDelete()"
                class="bg-danger text-white px-lg py-sm rounded-md font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="text-center py-2xl">
        <p class="text-danger">User not found</p>
        <button
          (click)="location.back()"
          class="text-primary font-semibold hover:text-primary-light mt-md"
        >
          Go back
        </button>
      </div>
    }
  `,
})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userStore = inject(UserStoreService);
  readonly location = inject(Location);

  readonly user = signal<User | undefined>(undefined);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    status: ['active', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.userStore.getById(id).subscribe(user => {
      this.user.set(user);
      if (user) {
        this.form.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      }
      this.isLoading.set(false);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isSaving.set(true);
    this.userStore.update(id, this.form.value).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        if (updated) {
          this.router.navigate(['/users']);
        }
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.userStore.delete(id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.router.navigate(['/users']);
        }
      },
    });
  }
}
