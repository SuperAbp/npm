import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityRoleComponent } from './roles/role/role.component';
import { IdentityUserComponent } from './users/user/user.component';
import { PermissionGuard } from '@abp/ng.core';
import { JWTGuard } from '@delon/auth';

const routes: Routes = [
  {
    path: 'user',
    component: IdentityUserComponent,
    canActivate: [JWTGuard, PermissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Users',
    },
  },
  {
    path: 'role',
    component: IdentityRoleComponent,
    canActivate: [PermissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Roles',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentityRoutingModule {}
