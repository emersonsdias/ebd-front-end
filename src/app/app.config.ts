import { LOCALE_ID, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiAuthInterceptor, apiErrorInterceptor } from './core';
import { loaderInterceptor } from './shared';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      apiAuthInterceptor,
      apiErrorInterceptor,
      loaderInterceptor
    ])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideLuxonDateAdapter()
  ]
};
