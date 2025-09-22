import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityRoleComponent } from './components/roles/role.component';
import { IdentityUserComponent } from './components/users/user.component';
import { permissionGuard } from '@abp/ng.core';
import { authJWTCanActivate } from '@delon/auth';
import { IdentityExtensionsGuard } from './guards';

const routes: Routes = [
  {
    path: 'user',
    component: IdentityUserComponent,
    canActivate: [authJWTCanActivate, permissionGuard, IdentityExtensionsGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Users',
    },
  },
  {
    path: 'role',
    component: IdentityRoleComponent,
    canActivate: [permissionGuard, IdentityExtensionsGuard],
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
