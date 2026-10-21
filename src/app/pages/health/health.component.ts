import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../services/health.service';
import { HealthCheckData } from '../../types';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">Health Check Dashboard</h1>
        <p class="text-text-secondary">System status and performance metrics</p>
      </div>

      @if (isLoading()) {
        <div class="text-center py-2xl">
          <p class="text-text-secondary">Loading health check...</p>
        </div>
      } @else if (healthData()) {
        <div class="space-y-lg">
          <div
            class="p-lg bg-white rounded-lg shadow border"
            [class.border-green-500]="healthData()?.status === 'up'"
            [class.border-danger]="healthData()?.status !== 'up'"
          >
            <div class="flex items-center gap-md mb-md">
              <div
                class="text-4xl"
                [class.text-success]="healthData()?.status === 'up'"
                [class.text-danger]="healthData()?.status !== 'up'"
              >
                @if (healthData()?.status === 'up') {
                  ✓
                } @else {
                  ✗
                }
              </div>
              <div>
                <h2 class="text-lg font-semibold text-text-primary">
                  System Status:
                  <span
                    [class.text-success]="healthData()?.status === 'up'"
                    [class.text-danger]="healthData()?.status !== 'up'"
                  >
                    {{ healthData()?.status | uppercase }}
                  </span>
                </h2>
                <p class="text-sm text-text-secondary">
                  Last checked: {{ healthData()?.timestamp | date: 'medium' }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
            @for (metric of getMetrics(); track metric.name) {
              <div class="p-lg bg-white rounded-lg shadow border border-border-default">
                <div class="flex items-start justify-between mb-md">
                  <div>
                    <h3 class="text-lg font-semibold text-text-primary">
                      {{ metric.name }}
                    </h3>
                    <p class="text-2xl font-bold text-primary mt-md">
                      {{ metric.value }}
                    </p>
                  </div>
                  <div
                    class="px-md py-sm rounded text-xs font-semibold capitalize"
                    [class.bg-green-100]="metric.status === 'healthy'"
                    [class.text-green-800]="metric.status === 'healthy'"
                    [class.bg-yellow-100]="metric.status === 'warning'"
                    [class.text-yellow-800]="metric.status === 'warning'"
                    [class.bg-red-100]="metric.status === 'critical'"
                    [class.text-red-800]="metric.status === 'critical'"
                  >
                    {{ metric.status }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow p-lg text-center border border-border-default">
          <p class="text-danger">Failed to load health check data</p>
        </div>
      }
    </div>
  `,
})
export class HealthComponent implements OnInit {
  private healthService = inject(HealthService);

  readonly healthData = signal<HealthCheckData | undefined>(undefined);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.healthService.getHealth().subscribe(data => {
      this.healthData.set(data);
      this.isLoading.set(false);
    });
  }

  getMetrics() {
    const data = this.healthData();
    if (!data) return [];

    return [
      data.database,
      data.memory,
      data.cpu,
      data.uptime,
      data.errorCount,
    ];
  }
}
