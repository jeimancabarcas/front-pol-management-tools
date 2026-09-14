export interface Asset {
  id: string;
  name: string;
  type: string;
  acquisitionValue: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // Optional aliases for backward compatibility if needed
  assetType?: string;
  category?: string;
}

export interface CreateAssetDto {
  name: string;
  type: string;
  acquisitionValue: number;
  description?: string;
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> {}
