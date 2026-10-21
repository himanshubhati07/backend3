import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';
import { AuditLogEntry } from '../../types';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Audit Logs</h1>
        <p class="text-text-secondary">System activity and security events</p>
      </div>

      @if (isLoading()) {
        <div class="text-center py-2xl">
          <p class="text-text-secondary">Loading audit logs...</p>
        </div>
      } @else if (logs().length === 0) {
        <div class="bg-white rounded-lg shadow p-lg text-center border border-border-default">
          <p class="text-text-secondary">No audit logs found</p>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow border border-border-default overflow-hidden">
          <table class="w-full">
            <thead class="bg-background-secondary border-b border-border-default">
              <tr>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  Action
                </th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  User
                </th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  Resource
                </th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  Details
                </th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  Timestamp
                </th>
                <th class="px-lg py-md text-left text-sm font-semibold text-text-primary">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr class="border-b border-border-light hover:bg-surface-hover">
                  <td class="px-lg py-md">
                    <span
                      class="inline-block px-md py-xs rounded text-xs font-semibold"
                      [class.bg-blue-100]="log.action === 'READ'"
                      [class.text-blue-800]="log.action === 'READ'"
                      [class.bg-green-100]="log.action === 'CREATE'"
                      [class.text-green-800]="log.action === 'CREATE'"
                      [class.bg-orange-100]="log.action === 'UPDATE'"
                      [class.text-orange-800]="log.action === 'UPDATE'"
                      [class.bg-red-100]="log.action === 'DELETE'"
                      [class.text-red-800]="log.action === 'DELETE'"
                    >
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="px-lg py-md text-text-secondary text-sm">{{ log.userId }}</td>
                  <td class="px-lg py-md text-text-primary font-semibold text-sm">
                    {{ log.resource }}
                  </td>
                  <td class="px-lg py-md text-text-secondary text-sm max-w-xs truncate">
                    {{ log.details }}
                  </td>
                  <td class="px-lg py-md text-text-secondary text-sm">
                    {{ log.timestamp | date: 'short' }}
                  </td>
                  <td class="px-lg py-md text-text-secondary text-sm font-mono">
                    {{ log.ipAddress }}
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
export class AuditComponent implements OnInit {
  private auditService = inject(AuditService);

  readonly logs = signal<AuditLogEntry[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.auditService.getAll().subscribe(logs => {
      this.logs.set(logs);
      this.isLoading.set(false);
    });
  }
}
