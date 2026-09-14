import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_REPOSITORY } from '../repositories/auth/auth.repository';
import { AuthResponse, LoginDto, User } from '../repositories/auth/models/auth.model';

const TOKEN_KEY = 'assetflow_auth_token';
const USER_KEY = 'assetflow_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authRepository = inject(AUTH_REPOSITORY);
  private readonly router = inject(Router);

  readonly accessToken = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.accessToken());

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.authRepository.login(credentials).pipe(
      tap((response) => {
        this.saveSession(response.accessToken, response.user);
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private saveSession(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.accessToken.set(token);
    this.currentUser.set(user);
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.accessToken.set(null);
    this.currentUser.set(null);
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(USER_KEY);
      if (data) {
        try {
          return JSON.parse(data) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  }
}
