import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset, CreateAssetDto, UpdateAssetDto } from './models/asset.model';

export interface AssetRepository {
  getAll(): Observable<Asset[]>;
  getById(id: string): Observable<Asset | null>;
  create(dto: CreateAssetDto): Observable<Asset>;
  update(id: string, dto: UpdateAssetDto): Observable<Asset>;
  delete(id: string): Observable<void>;
}

export const ASSET_REPOSITORY = new InjectionToken<AssetRepository>('ASSET_REPOSITORY');
