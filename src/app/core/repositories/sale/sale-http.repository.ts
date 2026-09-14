import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleRepository } from './sale.repository';
import { CreateSaleDto, Sale } from './models/sale.model';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class SaleHttpRepository implements SaleRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly endpoint = `${this.baseUrl}${API_ENDPOINTS.sales}`;

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.endpoint);
  }

  getById(id: string): Observable<Sale | null> {
    return this.http.get<Sale>(`${this.endpoint}/${id}`);
  }

  create(sale: CreateSaleDto): Observable<Sale> {
    return this.http.post<Sale>(this.endpoint, sale);
  }
}
