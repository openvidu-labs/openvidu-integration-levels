import { Routes } from '@angular/router';
import { AngularComponents } from './level-2-angular-components';
import { Home } from './home';
import { LowLevelSdk } from './level-3-low-level-sdk';
import { MeetEmbedded } from './level-1-meet-embedded';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'meet-embedded', component: MeetEmbedded },
  { path: 'angular-components', component: AngularComponents },
  { path: 'low-level-sdk', component: LowLevelSdk },
  { path: '**', redirectTo: '' },
];
