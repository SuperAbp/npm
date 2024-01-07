import { Routes } from '@angular/router';
import { SettingManagementComponent } from './components/setting-management.component';
import { authJWTCanActivate } from '@delon/auth';

export const routes: Routes = [
  {
    path: 'setting',
    component: SettingManagementComponent,
    canActivate: [authJWTCanActivate],
  },
];
