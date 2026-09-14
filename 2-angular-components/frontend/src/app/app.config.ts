import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OpenViduComponentsConfig, OpenViduComponentsModule } from 'openvidu-components-angular';

// Set production to true to silence the library's debug logs.
const openviduComponentsConfig: OpenViduComponentsConfig = { production: false };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    importProvidersFrom(OpenViduComponentsModule.forRoot(openviduComponentsConfig)),
  ],
};
