import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { MenuManagementComponent } from './components/menu-management.component';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuManagementComponent,
    canActivate: [authJWTCanActivate, PermissionGuard],
    data: {
      requiredPolicy: 'SuperAbpMenuManagement.Menu',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuManagementRoutingModule {}
