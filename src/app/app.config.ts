import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { ASSET_REPOSITORY } from './core/repositories/asset/asset.repository';
import { AssetHttpRepository } from './core/repositories/asset/asset-http.repository';
import { SALE_REPOSITORY } from './core/repositories/sale/sale.repository';
import { SaleHttpRepository } from './core/repositories/sale/sale-http.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    {
      provide: ASSET_REPOSITORY,
      useClass: AssetHttpRepository,
    },
    {
      provide: SALE_REPOSITORY,
      useClass: SaleHttpRepository,
    },
  ],
};
