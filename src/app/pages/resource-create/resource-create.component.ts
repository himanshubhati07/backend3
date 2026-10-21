import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ResourceStoreService } from '../../services/resource-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resource-create',
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
        <h1 class="text-2xl font-bold text-text-primary">Create New Resource</h1>
      </div>

      <div class="bg-white rounded-lg shadow p-lg border border-border-default">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-md">
          <div>
            <label for="name" class="block text-label text-text-primary mb-sm">
              Resource Name
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Database Connection"
            />
            @if (form.get('name')?.touched && form.get('name')?.invalid) {
              <p class="text-sm text-danger mt-xs">Name is required</p>
            }
          </div>

          <div>
            <label for="description" class="block text-label text-text-primary mb-sm">
              Description
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe this resource"
            ></textarea>
            @if (form.get('description')?.touched && form.get('description')?.invalid) {
              <p class="text-sm text-danger mt-xs">Description is required</p>
            }
          </div>

          <div>
            <label for="type" class="block text-label text-text-primary mb-sm">
              Type
            </label>
            <input
              id="type"
              type="text"
              formControlName="type"
              class="w-full px-md py-sm border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., database, service, cache"
            />
            @if (form.get('type')?.touched && form.get('type')?.invalid) {
              <p class="text-sm text-danger mt-xs">Type is required</p>
            }
          </div>

          <div class="flex gap-md pt-md">
            <button
              type="submit"
              [disabled]="form.invalid || isSaving()"
              class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light disabled:bg-border-light disabled:cursor-not-allowed transition-colors"
            >
              {{ isSaving() ? 'Creating...' : 'Create Resource' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ResourceCreateComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private resourceStore = inject(ResourceStoreService);
  private auth = inject(AuthService);
  readonly location = inject(Location);

  readonly isSaving = signal(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const { name, description, type } = this.form.value;
    const currentUser = this.auth.currentUser();

    this.resourceStore
      .create({
        name,
        description,
        type,
        owner: currentUser?.id || 'unknown',
        status: 'active',
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/resources']);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }
}
