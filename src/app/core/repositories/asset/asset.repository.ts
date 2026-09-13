import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from './models/asset.model';

export interface AssetRepository {
  getAll(): Observable<Asset[]>;
  getById(id: string): Observable<Asset | null>;
  create(asset: Omit<Asset, 'id'>): Observable<Asset>;
  update(id: string, asset: Partial<Asset>): Observable<Asset>;
  delete(id: string): Observable<void>;
}

export const ASSET_REPOSITORY = new InjectionToken<AssetRepository>('ASSET_REPOSITORY');
