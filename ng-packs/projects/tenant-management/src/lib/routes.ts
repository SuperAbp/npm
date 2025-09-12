import { Routes } from '@angular/router';
import { permissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { TenantManagementComponent } from './components/tenant-management.component';

export const routes: Routes = [
  {
    path: 'tenant',
    component: TenantManagementComponent,
    canActivate: [authJWTCanActivate, permissionGuard],
    data: {
      requiredPolicy: 'AbpTenantManagement.Tenants',
    },
  },
];
