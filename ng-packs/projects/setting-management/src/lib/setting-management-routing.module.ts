import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { SettingManagementComponent } from './components/setting-management.component';

const routes: Routes = [
  {
    path: 'setting',
    component: SettingManagementComponent,
    canActivate: [authJWTCanActivate],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingManagementRoutingModule {}
