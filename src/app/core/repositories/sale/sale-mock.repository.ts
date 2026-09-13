import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sale } from './models/sale.model';
import { SaleRepository } from './sale.repository';

@Injectable({
  providedIn: 'root',
})
export class SaleMockRepository implements SaleRepository {
  private sales: Sale[] = [
    {
      id: '1',
      assetId: '101',
      assetName: 'Impresora Térmica Zebra ZD421',
      assetType: 'Equipos de Cómputo',
      originalValue: 450.0,
      salePrice: 380.0,
      buyerName: 'Logística & Envíos Express S.A.S',
      buyerDocument: 'NIT 900.345.122-1',
      saleDate: '2025-01-20',
      notes: 'Baja por renovación tecnológica. Equipo en óptimo estado funcional.',
    },
    {
      id: '2',
      assetId: '102',
      assetName: 'Escritorio Ejecutivo en L con Cajonera',
      assetType: 'Mobiliario y Enseres',
      originalValue: 620.0,
      salePrice: 450.0,
      buyerName: 'Consultoría Integral de Negocios',
      buyerDocument: 'NIT 830.112.980-4',
      saleDate: '2025-02-05',
      notes: 'Venta de excedente de mobiliario por reestructuración de sede.',
    },
  ];

  getAll(): Observable<Sale[]> {
    return of([...this.sales]);
  }

  getById(id: string): Observable<Sale | null> {
    const item = this.sales.find((s) => s.id === id);
    return of(item ? { ...item } : null);
  }

  create(sale: Omit<Sale, 'id'>): Observable<Sale> {
    const newSale: Sale = {
      ...sale,
      id: (this.sales.length + 1).toString(),
    };
    this.sales.unshift(newSale);
    return of(newSale);
  }
}
