import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authJWTCanActivate } from '@delon/auth';
import { RegionComponent } from './components/region/region.component';

const routes: Routes = [
  {
    path: 'region',
    component: RegionComponent,
    canActivate: [authJWTCanActivate],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionManagementRoutingModule {}
