import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { User } from '../../types';

@Component({
  selector: 'app-users',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-primary">Users</h1>
          <p class="text-text-secondary">Manage user accounts and roles</p>
        </div>
        <button
          (click)="navigateTo('/users/create')"
          class="bg-primary text-white px-lg py-sm rounded-md font-semibold hover:bg-primary-light transition-colors"
        >
          + Create User
        </button>
      </div>

      @if (isLoading()) {
        <div class="text-center py-2xl">
          <p class="text-text-secondary">Loading users...</p>
        </div>
      } @else if (users().length === 0) {
        <div class="bg-white rounded-lg shadow p-lg text-center border border-border-default">
          <p class="text-text-secondary mb-md">No users found</p>
          <button
            (click)="navigateTo('/users/create')"
            class="text-primary font-semibold hover:text-primary-light"
          >
            Create the first user
          </button>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow border border-border-default overflow-hidden">
          <table class="w-full">
            <thead class="bg-background-secondary border-b border-border-default">
              <tr>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Name</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Email</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Role</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Status</th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr class="border-b border-border-light hover:bg-surface-hover cursor-pointer">
                  <td class="px-lg py-md text-text-primary" (click)="navigateTo('/users/' + user.id)">
                    {{ user.name }}
                  </td>
                  <td class="px-lg py-md text-text-secondary" (click)="navigateTo('/users/' + user.id)">
                    {{ user.email }}
                  </td>
                  <td class="px-lg py-md">
                    <span
                      class="inline-block px-md py-xs rounded text-xs font-semibold"
                      [class.bg-blue-100]="user.role === 'admin'"
                      [class.text-blue-800]="user.role === 'admin'"
                      [class.bg-green-100]="user.role !== 'admin'"
                      [class.text-green-800]="user.role !== 'admin'"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-lg py-md">
                    <span
                      class="inline-block px-md py-xs rounded text-xs font-semibold"
                      [class.bg-green-100]="user.status === 'active'"
                      [class.text-green-800]="user.status === 'active'"
                      [class.bg-gray-100]="user.status !== 'active'"
                      [class.text-gray-800]="user.status !== 'active'"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-lg py-md">
                    <button
                      (click)="navigateTo('/users/' + user.id)"
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
export class UsersComponent implements OnInit {
  private router = inject(Router);
  private userStore = inject(UserStoreService);

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.userStore.getAll().subscribe(users => {
      this.users.set(users);
      this.isLoading.set(false);
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
