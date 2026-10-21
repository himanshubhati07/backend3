import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Resource } from '../types';
import { mockResources } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class ResourceStoreService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private load(): Resource[] {
    const raw = localStorage.getItem('resources');
    if (raw) {
      return JSON.parse(raw);
    }
    // MOCK: seed from mock data
    localStorage.setItem('resources', JSON.stringify(mockResources));
    return mockResources;
  }

  private localGetAll(): Resource[] {
    // MOCK: load from localStorage
    return this.load();
  }

  private localGetById(id: string): Resource | undefined {
    // MOCK: find by id from localStorage
    return this.load().find(r => r.id === id);
  }

  private localCreate(
    input: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
  ): Resource {
    // MOCK: create and persist new resource
    const all = this.load();
    const now = new Date().toISOString();
    const resource: Resource = {
      ...input,
      id: `r${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(resource);
    localStorage.setItem('resources', JSON.stringify(all));
    return resource;
  }

  private localUpdate(id: string, input: Partial<Resource>): Resource | undefined {
    // MOCK: update and persist resource
    const all = this.load();
    const index = all.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    all[index] = {
      ...all[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('resources', JSON.stringify(all));
    return all[index];
  }

  private localDelete(id: string): boolean {
    // MOCK: delete and persist resource
    const all = this.load();
    const filtered = all.filter(r => r.id !== id);
    if (filtered.length === all.length) return false;

    localStorage.setItem('resources', JSON.stringify(filtered));
    return true;
  }

  getAll(): Observable<Resource[]> {
    if (this.USE_MOCK) {
      return of(this.localGetAll());
    }

    return this.http.get<Resource[]>('/api/v1/resources');
  }

  getById(id: string): Observable<Resource | undefined> {
    if (this.USE_MOCK) {
      return of(this.localGetById(id));
    }

    return this.http.get<Resource>(`/api/v1/resources/${id}`);
  }

  create(input: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Observable<Resource> {
    if (this.USE_MOCK) {
      return of(this.localCreate(input));
    }

    return this.http.post<Resource>('/api/v1/resources', input);
  }

  update(id: string, input: Partial<Resource>): Observable<Resource | undefined> {
    if (this.USE_MOCK) {
      return of(this.localUpdate(id, input));
    }

    return this.http.put<Resource>(`/api/v1/resources/${id}`, input);
  }

  delete(id: string): Observable<boolean> {
    if (this.USE_MOCK) {
      return of(this.localDelete(id));
    }

    return this.http
      .delete<{ success: boolean }>(`/api/v1/resources/${id}`)
      .pipe(map(res => res.success));
  }
}
