import { Component, ViewEncapsulation, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocsService } from '../../services/api-docs.service';
import { ApiEndpoint } from '../../types';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="space-y-lg">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">API Documentation</h1>
        <p class="text-text-secondary">Browse available API endpoints</p>
      </div>

      @if (isLoading()) {
        <div class="text-center py-2xl">
          <p class="text-text-secondary">Loading API documentation...</p>
        </div>
      } @else if (endpoints().length === 0) {
        <div class="bg-white rounded-lg shadow p-lg text-center border border-border-default">
          <p class="text-text-secondary">No endpoints found</p>
        </div>
      } @else {
        <div class="space-y-md">
          @for (endpoint of endpoints(); track endpoint.path) {
            <div class="bg-white rounded-lg shadow p-lg border border-border-default">
              <div class="flex items-start gap-md mb-md">
                <div
                  class="px-md py-xs rounded text-xs font-semibold text-white min-w-12"
                  [class.bg-blue-500]="endpoint.method === 'GET'"
                  [class.bg-green-500]="endpoint.method === 'POST'"
                  [class.bg-orange-500]="endpoint.method === 'PUT'"
                  [class.bg-purple-500]="endpoint.method === 'PATCH'"
                  [class.bg-red-500]="endpoint.method === 'DELETE'"
                >
                  {{ endpoint.method }}
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-text-primary mb-sm font-mono">
                    {{ endpoint.path }}
                  </h3>
                  <p class="text-text-secondary mb-md">{{ endpoint.description }}</p>

                  @if (endpoint.parameters && endpoint.parameters.length > 0) {
                    <div class="mb-md">
                      <h4 class="text-sm font-semibold text-text-primary mb-sm">
                        Parameters:
                      </h4>
                      <div class="bg-background-secondary rounded p-md">
                        @for (param of endpoint.parameters; track param.name) {
                          <div class="text-sm text-text-secondary mb-sm">
                            <span class="font-semibold">{{ param.name }}</span>
                            <span class="text-xs">({{ param.type }})</span>
                            @if (param.required) {
                              <span class="text-danger text-xs font-semibold ml-sm">required</span>
                            }
                            - {{ param.description }}
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <div>
                    <h4 class="text-sm font-semibold text-text-primary mb-sm">
                      Responses:
                    </h4>
                    <div class="bg-background-secondary rounded p-md">
                      @for (response of endpoint.responses; track response.status) {
                        <div class="text-sm text-text-secondary mb-sm">
                          <span class="font-semibold">{{ response.status }}</span>
                          - {{ response.description }}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ApiDocsComponent implements OnInit {
  private apiDocsService = inject(ApiDocsService);

  readonly endpoints = signal<ApiEndpoint[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.apiDocsService.getAll().subscribe(endpoints => {
      this.endpoints.set(endpoints);
      this.isLoading.set(false);
    });
  }
}
