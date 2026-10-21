import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ResourceStoreService } from '../../services/resource-store.service';
import { Resource } from '../../types';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isLoading()) {
      <div class="text-center py-2xl">
        <p class="text-text-secondary">Loading resource...</p>
      </div>
    } @else if (resource()) {
      <div class="space-y-lg">
        <div class="flex items-center gap-md">
          <button
            (click)="location.back()"
            class="text-primary font-semibold hover:text-primary-light"
          >
            ← Back
          </button>
          <h1 class="text-2xl font-bold text-text-primary">{{ resource()?.name }}</h1>
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
              />
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
              ></textarea>
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
              />
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
                <option value="archived">Archived</option>
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
        <p class="text-danger">Resource not found</p>
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
export class ResourceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private resourceStore = inject(ResourceStoreService);
  readonly location = inject(Location);

  readonly resource = signal<Resource | undefined>(undefined);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);

  readonly form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    status: ['active', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.resourceStore.getById(id).subscribe(resource => {
      this.resource.set(resource);
      if (resource) {
        this.form.patchValue({
          name: resource.name,
          description: resource.description,
          type: resource.type,
          status: resource.status,
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
    this.resourceStore.update(id, this.form.value).subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        if (updated) {
          this.router.navigate(['/resources']);
        }
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.resourceStore.delete(id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.router.navigate(['/resources']);
        }
      },
    });
  }
}
