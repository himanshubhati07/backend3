import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HealthCheckData } from '../types';
import { mockHealthCheckData } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private localGetHealth(): HealthCheckData {
    // MOCK: return health check data with current timestamp
    return {
      ...mockHealthCheckData,
      timestamp: new Date().toISOString(),
    };
  }

  getHealth(): Observable<HealthCheckData> {
    if (this.USE_MOCK) {
      return of(this.localGetHealth());
    }

    return this.http.get<HealthCheckData>('/api/v1/health');
  }
}
