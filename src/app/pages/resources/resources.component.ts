import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResourceStoreService } from '../../services/resource-store.service';
import { Resource } from '../../types';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-primary">Resources</h1>
          <p class="text-text-secondary">Manage your application resources</p>
        </div>
        <button
          (click)="navigateTo('/resources/create')"
          class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light transition-colors"
        >
          + Create Resource
        </button>
      </div>

      @if (isLoading()) {
        <div class="text-center py-2xl">
          <p class="text-text-secondary">Loading resources...</p>
        </div>
      } @else if (resources().length === 0) {
        <div class="bg-white rounded-lg shadow p-lg text-center border border-border-default">
          <p class="text-text-secondary mb-md">No resources found</p>
          <button
            (click)="navigateTo('/resources/create')"
            class="text-primary font-semibold hover:text-primary-light"
          >
            Create the first resource
          </button>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow border border-border-default overflow-hidden">
          <table class="w-full">
            <thead class="bg-background-secondary border-b border-border-default">
              <tr>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Name</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Type</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Status</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Owner</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Created</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (resource of resources(); track resource.id) {
                <tr class="border-b border-border-light hover:bg-surface-hover cursor-pointer">
                  <td
                    class="px-lg py-md text-text-primary font-semibold"
                    (click)="navigateTo('/resources/' + resource.id)"
                  >
                    {{ resource.name }}
                  </td>
                  <td
                    class="px-lg py-md text-text-secondary"
                    (click)="navigateTo('/resources/' + resource.id)"
                  >
                    {{ resource.type }}
                  </td>
                  <td class="px-lg py-md">
                    <span
                      class="inline-block px-md py-xs rounded text-xs font-semibold"
                      [class.bg-green-100]="resource.status === 'active'"
                      [class.text-green-800]="resource.status === 'active'"
                      [class.bg-gray-100]="resource.status !== 'active'"
                      [class.text-gray-800]="resource.status !== 'active'"
                    >
                      {{ resource.status }}
                    </span>
                  </td>
                  <td
                    class="px-lg py-md text-text-secondary"
                    (click)="navigateTo('/resources/' + resource.id)"
                  >
                    {{ resource.owner }}
                  </td>
                  <td
                    class="px-lg py-md text-text-secondary text-sm"
                    (click)="navigateTo('/resources/' + resource.id)"
                  >
                    {{ resource.createdAt | date: 'short' }}
                  </td>
                  <td class="px-lg py-md">
                    <button
                      (click)="navigateTo('/resources/' + resource.id)"
                      class="text-primary font-semibold hover:text-primary-light text-sm"
                    >
                      View/Edit
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ResourcesComponent implements OnInit {
  private router = inject(Router);
  private resourceStore = inject(ResourceStoreService);

  readonly resources = signal<Resource[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.resourceStore.getAll().subscribe(resources => {
      this.resources.set(resources);
      this.isLoading.set(false);
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
