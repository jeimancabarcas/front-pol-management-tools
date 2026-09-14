import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetRepository } from './asset.repository';
import { Asset, CreateAssetDto, UpdateAssetDto } from './models/asset.model';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AssetHttpRepository implements AssetRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly endpoint = `${this.baseUrl}${API_ENDPOINTS.assets}`;

  getAll(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.endpoint);
  }

  getById(id: string): Observable<Asset | null> {
    return this.http.get<Asset>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateAssetDto): Observable<Asset> {
    return this.http.post<Asset>(this.endpoint, dto);
  }

  update(id: string, dto: UpdateAssetDto): Observable<Asset> {
    return this.http.patch<Asset>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
