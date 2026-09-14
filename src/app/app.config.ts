import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { ASSET_REPOSITORY } from './core/repositories/asset/asset.repository';
import { AssetHttpRepository } from './core/repositories/asset/asset-http.repository';
import { SALE_REPOSITORY } from './core/repositories/sale/sale.repository';
import { SaleHttpRepository } from './core/repositories/sale/sale-http.repository';
import { DASHBOARD_REPOSITORY } from './core/repositories/dashboard/dashboard.repository';
import { DashboardHttpRepository } from './core/repositories/dashboard/dashboard-http.repository';
import { AUTH_REPOSITORY } from './core/repositories/auth/auth.repository';
import { AuthHttpRepository } from './core/repositories/auth/auth-http.repository';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: ASSET_REPOSITORY,
      useClass: AssetHttpRepository,
    },
    {
      provide: SALE_REPOSITORY,
      useClass: SaleHttpRepository,
    },
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: DashboardHttpRepository,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthHttpRepository,
    },
  ],
};
