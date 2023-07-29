import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { AuditLoggingComponent } from './components/audit-logging.component';

const routes: Routes = [
  {
    path: 'audit-logging',
    component: AuditLoggingComponent,
    canActivate: [authJWTCanActivate, PermissionGuard],
    data: {
      requiredPolicy: 'SuperAbpAuditLogging.AuditLog',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditLoggingRoutingModule {}
