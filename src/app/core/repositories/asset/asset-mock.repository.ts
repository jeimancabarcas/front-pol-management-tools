import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Asset } from './models/asset.model';
import { AssetRepository } from './asset.repository';

@Injectable({
  providedIn: 'root',
})
export class AssetMockRepository implements AssetRepository {
  private assets: Asset[] = [
    {
      id: '1',
      assetTag: 'ACT-2024-001',
      name: 'Laptop Lenovo ThinkPad T14s Gen 4',
      category: 'Equipos de Cómputo',
      assetType: 'Informático',
      location: 'Edificio Central - Piso 3 (TI)',
      acquisitionValue: 1450.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2025-01-15',
      batchCode: 'ACT-2025-Q1',
    },
    {
      id: '2',
      assetTag: 'ACT-2024-002',
      name: 'Monitor Dell UltraSharp U2723QE 27" 4K',
      category: 'Equipos de Cómputo',
      assetType: 'Periférico',
      location: 'Edificio Central - Piso 3 (Diseño)',
      acquisitionValue: 580.0,
      currency: 'USD',
      status: 'Assigned',
      custodian: 'Carlos Mendoza',
      registrationDate: '2025-01-18',
      batchCode: 'ACT-2025-Q1',
    },
    {
      id: '3',
      assetTag: 'ACT-2024-003',
      name: 'Servidor Rack Dell PowerEdge R750',
      category: 'Maquinaria y Herramientas',
      assetType: 'Infraestructura',
      location: 'Data Center - Rack 04',
      acquisitionValue: 8900.0,
      currency: 'USD',
      status: 'Assigned',
      custodian: 'Administración de Redes',
      registrationDate: '2024-11-20',
      batchCode: 'ACT-2024-Q4',
    },
    {
      id: '4',
      assetTag: 'ACT-2024-004',
      name: 'Silla Ergonómica Herman Miller Aeron',
      category: 'Mobiliario y Enseres',
      assetType: 'Mobiliario',
      location: 'Edificio Norte - Gerencia',
      acquisitionValue: 1150.0,
      currency: 'USD',
      status: 'Assigned',
      custodian: 'Dra. Patricia Silva',
      registrationDate: '2024-12-05',
      batchCode: 'ACT-2024-Q4',
    },
    {
      id: '5',
      assetTag: 'ACT-2024-005',
      name: 'Impresora Multifuncional HP LaserJet Enterprise',
      category: 'Equipos de Cómputo',
      assetType: 'Impresión',
      location: 'Piso 2 - Área Administrativa',
      acquisitionValue: 920.0,
      currency: 'USD',
      status: 'Maintenance',
      custodian: 'Soporte Técnico',
      registrationDate: '2024-10-10',
      batchCode: 'ACT-2024-Q3',
    },
    {
      id: '6',
      assetTag: 'ACT-2024-006',
      name: 'Proyector Láser Epson PowerLite L530U',
      category: 'Equipos de Cómputo',
      assetType: 'Audiovisual',
      location: 'Sala de Juntas Principal',
      acquisitionValue: 2100.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2025-02-01',
      batchCode: 'ACT-2025-Q1',
    },
    {
      id: '7',
      assetTag: 'ACT-2024-007',
      name: 'Vehículo Utilitario Toyota Hilux 4x4',
      category: 'Vehículos Institucionales',
      assetType: 'Transporte',
      location: 'Parqueadero Central - Plaza 12',
      acquisitionValue: 34500.0,
      currency: 'USD',
      status: 'Assigned',
      custodian: 'Operaciones Logísticas',
      registrationDate: '2024-08-14',
      batchCode: 'ACT-2024-Q3',
    },
  ];

  getAll(): Observable<Asset[]> {
    return of([...this.assets]);
  }

  getById(id: string): Observable<Asset | null> {
    const item = this.assets.find((a) => a.id === id);
    return of(item ? { ...item } : null);
  }

  create(asset: Omit<Asset, 'id'>): Observable<Asset> {
    const newAsset: Asset = {
      ...asset,
      id: (this.assets.length + 1).toString(),
    };
    this.assets.unshift(newAsset);
    return of(newAsset);
  }

  update(id: string, partial: Partial<Asset>): Observable<Asset> {
    const index = this.assets.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.assets[index] = { ...this.assets[index], ...partial };
      return of({ ...this.assets[index] });
    }
    throw new Error(`Asset with id ${id} not found`);
  }

  delete(id: string): Observable<void> {
    this.assets = this.assets.filter((a) => a.id !== id);
    return of(void 0);
  }
}
