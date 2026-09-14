import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { AuthResponse, LoginDto } from './models/auth.model';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly endpoint = `${this.baseUrl}${API_ENDPOINTS.authLogin}`;

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.endpoint, dto);
  }
}
