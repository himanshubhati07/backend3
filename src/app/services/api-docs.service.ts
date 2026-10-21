import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../types';
import { mockApiEndpoints } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class ApiDocsService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private localGetAll(): ApiEndpoint[] {
    // MOCK: return API endpoints
    return mockApiEndpoints;
  }

  getAll(): Observable<ApiEndpoint[]> {
    if (this.USE_MOCK) {
      return of(this.localGetAll());
    }

    return this.http.get<ApiEndpoint[]>('/api/v1/docs');
  }
}
