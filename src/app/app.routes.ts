import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/templates/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
          import('./features/sales/pages/asset-sale/asset-sale').then(
            (m) => m.AssetSaleComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
