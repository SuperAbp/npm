import { Routes } from '@angular/router';
import { AuditLoggingComponent } from './components/audit-logging.component';
import { authJWTCanActivate } from '@delon/auth';
import { permissionGuard } from '@abp/ng.core';

export const routes: Routes = [
  {
    path: 'audit-logging',
    component: AuditLoggingComponent,
    canActivate: [authJWTCanActivate, permissionGuard],
    data: {
      requiredPolicy: 'SuperAbpAuditLogging.AuditLog',
    },
  },
];
