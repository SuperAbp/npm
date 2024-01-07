import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '@abp/ng.core';
import { JWTGuard } from '@delon/auth';
import { RegionComponent } from './components/region/region.component';

const routes: Routes = [
  {
    path: 'region',
    component: RegionComponent,
    canActivate: [JWTGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionManagementRoutingModule {}
