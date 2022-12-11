import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { JWTGuard } from '@delon/auth';
import { MenuManagementComponent } from './components/menu-management.component';

const routes: Routes = [
    {
      path: 'menu', component: MenuManagementComponent,
      canActivate: [JWTGuard, PermissionGuard],
      data: {
        requiredPolicy: 'SnowMenuManagement.Menu.Management',
      },
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuManagementRoutingModule { }
