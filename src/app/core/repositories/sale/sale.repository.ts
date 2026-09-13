import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from './models/sale.model';

export interface SaleRepository {
  getAll(): Observable<Sale[]>;
  getById(id: string): Observable<Sale | null>;
  create(sale: Omit<Sale, 'id'>): Observable<Sale>;
}

export const SALE_REPOSITORY = new InjectionToken<SaleRepository>('SALE_REPOSITORY');
