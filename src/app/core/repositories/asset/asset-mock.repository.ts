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
      assetType: 'Equipos de Cómputo',
      description: 'Intel Core i7 13va Gen, 32GB RAM, 1TB SSD. Incluye cargador USB-C y docking station.',
      location: 'Edificio Central - Sede Principal',
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
      assetType: 'Equipos de Cómputo',
      description: 'Panel IPS Black 4K UHD con hub USB-C integrado y calibración de color 98% DCI-P3.',
      location: 'Edificio Central - Sede Principal',
      acquisitionValue: 580.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2025-01-18',
      batchCode: 'ACT-2025-Q1',
    },
    {
      id: '3',
      assetTag: 'ACT-2024-003',
      name: 'Servidor Rack Dell PowerEdge R750',
      category: 'Maquinaria y Herramientas',
      assetType: 'Maquinaria y Herramientas',
      description: 'Doble procesador Intel Xeon Gold, 128GB ECC RAM, 8 bahías SAS Hot-Plug con fuente redundante.',
      location: 'Edificio Central - Sede Principal',
      acquisitionValue: 8900.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2024-11-20',
      batchCode: 'ACT-2024-Q4',
    },
    {
      id: '4',
      assetTag: 'ACT-2024-004',
      name: 'Silla Ergonómica Herman Miller Aeron',
      category: 'Mobiliario y Enseres',
      assetType: 'Mobiliario y Enseres',
      description: 'Malla transpirable Pellicle grafito con soporte lumbar PostureFit SL y brazos regulables 3D.',
      location: 'Edificio Central - Sede Principal',
      acquisitionValue: 1150.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2024-12-05',
      batchCode: 'ACT-2024-Q4',
    },
    {
      id: '5',
      assetTag: 'ACT-2024-005',
      name: 'Impresora Multifuncional HP LaserJet Enterprise',
      category: 'Equipos de Cómputo',
      assetType: 'Equipos de Cómputo',
      description: 'Impresión dúplex automática 55 ppm, alimentador ADF 100 hojas y panel táctil color 8".',
      location: 'Edificio Central - Sede Principal',
      acquisitionValue: 920.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2024-10-10',
      batchCode: 'ACT-2024-Q3',
    },
    {
      id: '6',
      assetTag: 'ACT-2024-006',
      name: 'Proyector Láser Epson PowerLite L530U',
      category: 'Equipos de Cómputo',
      assetType: 'Equipos de Cómputo',
      description: 'Resolución WUXGA, 5200 lúmenes de brillo, conectividad HDBaseT y HDMI doble.',
      location: 'Edificio Central - Sede Principal',
      acquisitionValue: 2100.0,
      currency: 'USD',
      status: 'Available',
      custodian: 'Sin Asignar',
      registrationDate: '2025-02-01',
      batchCode: 'ACT-2025-Q1',
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
