import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { provideRouterFeature } from './shared/+state/router.feature';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding()
    ),
    provideHttpClient(),

    provideStore(),
    provideRouterFeature(),
    provideEffects(),
    isDevMode() ? provideStoreDevtools() : []
  ]
};
