import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { mockUsers } from '../data/mock-data';
import { AuthUser } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // TODO(USE_MOCK): verify path + response shape against the real
  // backend's OpenAPI schema before flipping this to false.
  readonly USE_MOCK = true;

  constructor(private http: HttpClient) {}

  private localLogin(email: string, password: string): boolean {
    // MOCK: verify against mock users with password check
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return false;
    }

    const token = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: `mock-jwt-${user.id}`,
    };

    localStorage.setItem('auth_token', JSON.stringify(token));
    return true;
  }

  private localSignup(
    name: string,
    email: string,
    password: string
  ): AuthUser | null {
    // MOCK: check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return null;
    }

    // MOCK: get app users from localStorage or initialize
    const appUsersRaw = localStorage.getItem('app_users');
    const appUsers = appUsersRaw ? JSON.parse(appUsersRaw) : [];

    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      email,
      name,
      role: 'user',
    };

    appUsers.push({
      ...newUser,
      password,
      createdAt: new Date().toISOString(),
      status: 'active',
    });

    localStorage.setItem('app_users', JSON.stringify(appUsers));

    const token = {
      ...newUser,
      token: `mock-jwt-${newUser.id}`,
    };

    localStorage.setItem('auth_token', JSON.stringify(token));
    return newUser;
  }

  login(email: string, password: string): Observable<boolean> {
    if (this.USE_MOCK) {
      return of(this.localLogin(email, password));
    }

    return this.http
      .post<{ token: string; user: AuthUser }>('/api/v1/auth/login', {
        email,
        password,
      })
      .pipe(
        tap(res => {
          localStorage.setItem('auth_token', JSON.stringify(res));
        }),
        map(() => true)
      );
  }

  signup(
    name: string,
    email: string,
    password: string
  ): Observable<AuthUser | null> {
    if (this.USE_MOCK) {
      return of(this.localSignup(name, email, password));
    }

    return this.http
      .post<AuthUser>('/api/v1/auth/signup', {
        name,
        email,
        password,
      })
      .pipe(
        tap(user => {
          const token = {
            ...user,
            token: `jwt-token`,
          };
          localStorage.setItem('auth_token', JSON.stringify(token));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  currentUser(): AuthUser | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      return JSON.parse(token);
    } catch {
      return null;
    }
  }

  currentRole(): 'admin' | 'user' | null {
    return this.currentUser()?.role ?? null;
  }

  getUsers(): Observable<any[]> {
    const mockAllUsers = [
      ...mockUsers,
      ...(localStorage.getItem('app_users')
        ? JSON.parse(localStorage.getItem('app_users') || '[]')
        : []),
    ];

    if (this.USE_MOCK) {
      return of(mockAllUsers);
    }

    return this.http.get<any[]>('/api/v1/users');
  }
}
