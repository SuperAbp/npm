import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { DelonACLModule } from '@delon/acl';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RegionComponent } from './components/region/region.component';
import { RegionManagementRoutingModule } from './region-management-routing.module';

@NgModule({
  declarations: [RegionComponent],
  imports: [
    RegionManagementRoutingModule,
    CoreModule,
    NzCardModule,
    DelonACLModule,
    PageHeaderModule,
  ],
  exports: [RegionComponent],
})
export class RegionManagementModule {}
