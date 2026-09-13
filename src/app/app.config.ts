import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ASSET_REPOSITORY } from './core/repositories/asset/asset.repository';
import { AssetMockRepository } from './core/repositories/asset/asset-mock.repository';
import { SALE_REPOSITORY } from './core/repositories/sale/sale.repository';
import { SaleMockRepository } from './core/repositories/sale/sale-mock.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: ASSET_REPOSITORY,
      useClass: AssetMockRepository,
    },
    {
      provide: SALE_REPOSITORY,
      useClass: SaleMockRepository,
    },
  ],
};
