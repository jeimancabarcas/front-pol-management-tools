import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardRepository } from './dashboard.repository';
import { DashboardSummary } from './models/dashboard.model';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class DashboardHttpRepository implements DashboardRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly endpoint = `${this.baseUrl}${API_ENDPOINTS.dashboardSummary}`;

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.endpoint);
  }
}
