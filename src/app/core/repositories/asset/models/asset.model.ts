export type AssetStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Sold';

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: string;
  assetType: string;
  location: string;
  acquisitionValue: number;
  currency: string;
  status: AssetStatus;
  custodian?: string;
  registrationDate: string;
  batchCode?: string;
}
