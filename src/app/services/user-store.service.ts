import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../types';
import { mockUsers } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private load(): User[] {
    const raw = localStorage.getItem('users');
    if (raw) {
      return JSON.parse(raw);
    }
    // MOCK: seed from mock data
    localStorage.setItem('users', JSON.stringify(mockUsers));
    return mockUsers;
  }

  private localGetAll(): User[] {
    // MOCK: load from localStorage
    return this.load();
  }

  private localGetById(id: string): User | undefined {
    // MOCK: find by id from localStorage
    return this.load().find(u => u.id === id);
  }

  private localCreate(input: Omit<User, 'id' | 'createdAt'>): User {
    // MOCK: create and persist new user
    const all = this.load();
    const user: User = {
      ...input,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(user);
    localStorage.setItem('users', JSON.stringify(all));
    return user;
  }

  private localUpdate(id: string, input: Partial<User>): User | undefined {
    // MOCK: update and persist user
    const all = this.load();
    const index = all.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    all[index] = { ...all[index], ...input };
    localStorage.setItem('users', JSON.stringify(all));
    return all[index];
  }

  private localDelete(id: string): boolean {
    // MOCK: delete and persist user
    const all = this.load();
    const filtered = all.filter(u => u.id !== id);
    if (filtered.length === all.length) return false;

    localStorage.setItem('users', JSON.stringify(filtered));
    return true;
  }

  getAll(): Observable<User[]> {
    if (this.USE_MOCK) {
      return of(this.localGetAll());
    }

    return this.http.get<User[]>('/api/v1/users');
  }

  getById(id: string): Observable<User | undefined> {
    if (this.USE_MOCK) {
      return of(this.localGetById(id));
    }

    return this.http.get<User>(`/api/v1/users/${id}`);
  }

  create(input: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    if (this.USE_MOCK) {
      return of(this.localCreate(input));
    }

    return this.http.post<User>('/api/v1/users', input);
  }

  update(id: string, input: Partial<User>): Observable<User | undefined> {
    if (this.USE_MOCK) {
      return of(this.localUpdate(id, input));
    }

    return this.http.put<User>(`/api/v1/users/${id}`, input);
  }

  delete(id: string): Observable<boolean> {
    if (this.USE_MOCK) {
      return of(this.localDelete(id));
    }

    return this.http
      .delete<{ success: boolean }>(`/api/v1/users/${id}`)
      .pipe(map(res => res.success));
  }
}
