import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginDto } from './models/auth.model';

export interface AuthRepository {
  login(dto: LoginDto): Observable<AuthResponse>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
