export interface SaleItem {
  assetId: string;
  assetName: string;
  assetType: string;
  originalValue: number;
  salePrice: number;
}

export interface Sale {
  id: string;
  buyerName: string;
  buyerDocument?: string;
  saleDate: string;
  notes?: string;
  totalAmount: number;
  items: SaleItem[];
  createdAt?: string;

  // Optional flat aliases for single-item backwards compatibility
  assetId?: string;
  assetName?: string;
  assetType?: string;
  originalValue?: number;
  salePrice?: number;
}

export interface CreateSaleDto {
  buyerName: string;
  buyerDocument?: string;
  saleDate: string;
  notes?: string;
  totalAmount?: number;
  items: SaleItem[];
}
