export interface Sale {
  id: string;
  assetId: string;
  assetName: string;
  assetType: string;
  originalValue: number;
  salePrice: number;
  buyerName: string;
  buyerDocument?: string;
  saleDate: string;
  notes?: string;
}
