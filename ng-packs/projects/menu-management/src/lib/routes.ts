import { Routes } from '@angular/router';
import { permissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { MenuManagementComponent } from './components/menu-management.component';

export const routes: Routes = [
  {
    path: 'menu',
    component: MenuManagementComponent,
    canActivate: [authJWTCanActivate, permissionGuard],
    data: {
      requiredPolicy: 'SuperAbpMenuManagement.Menu',
    },
  },
];
