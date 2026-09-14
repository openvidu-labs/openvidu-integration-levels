import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { OpenViduComponentsConfig, OpenViduComponentsModule } from 'openvidu-components-angular';

import { routes } from './app.routes';

// Level 2 only. Set production to true to silence the library's debug logs.
const openviduComponentsConfig: OpenViduComponentsConfig = { production: false };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(OpenViduComponentsModule.forRoot(openviduComponentsConfig)),
  ],
};
