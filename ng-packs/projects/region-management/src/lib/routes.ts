import { Routes } from '@angular/router';
import { RegionComponent } from './components/region/region.component';
import { authJWTCanActivate } from '@delon/auth';

export const routes: Routes = [
  {
    path: 'region',
    component: RegionComponent,
    canActivate: [authJWTCanActivate],
  },
];
