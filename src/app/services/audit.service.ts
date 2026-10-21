import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuditLogEntry } from '../types';
import { mockAuditLogs } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private localGetAll(): AuditLogEntry[] {
    // MOCK: return audit logs
    return mockAuditLogs;
  }

  getAll(): Observable<AuditLogEntry[]> {
    if (this.USE_MOCK) {
      return of(this.localGetAll());
    }

    return this.http.get<AuditLogEntry[]>('/api/v1/audit-logs');
  }
}
