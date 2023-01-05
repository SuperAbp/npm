import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { JWTGuard } from '@delon/auth';
import { SettingManagementComponent } from './components/setting-management.component';

const routes: Routes = [
  {
    path: 'setting',
    component: SettingManagementComponent,
    canActivate: [JWTGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingManagementRoutingModule {}
