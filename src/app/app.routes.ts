import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full',
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import(
        './features/inventory/pages/asset-inventory/asset-inventory'
      ).then((m) => m.AssetInventoryComponent),
  },
  {
    path: 'inventory/register',
    loadComponent: () =>
      import(
        './features/inventory/pages/asset-register/asset-register'
      ).then((m) => m.AssetRegisterComponent),
  },
  {
    path: 'inventory/sale',
    loadComponent: () =>
      import(
        './features/sales/pages/asset-sale/asset-sale'
      ).then((m) => m.AssetSaleComponent),
  },
  {
    path: '**',
    redirectTo: 'inventory',
  },
];
