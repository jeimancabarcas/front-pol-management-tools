export interface CreateSaleItemDto {
  assetId: string;
  salePrice: number;
}

export interface CreateSaleDto {
  buyerName: string;
  buyerDocument: string;
  saleDate: string;
  saleReason: string;
  items: CreateSaleItemDto[];
}

export interface SaleItem {
  id?: string;
  assetId: string;
  assetName: string;
  salePrice: number;
  assetType?: string;
  originalValue?: number;
}

export interface Sale {
  id: string;
  buyerName: string;
  buyerDocument: string;
  saleDate: string;
  saleReason: string;
  totalAmount: number;
  items: SaleItem[];
  createdAt?: string;

  // Optional legacy fields for backward compatibility
  assetName?: string;
  assetType?: string;
  salePrice?: number;
  notes?: string;
}
