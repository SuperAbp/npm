import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { DelonACLModule } from '@delon/acl';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RegionComponent } from './components/region/region.component';
import { RegionManagementRoutingModule } from './region-management-routing.module';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { STModule } from '@delon/abc/st';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RegionProvinceEditComponent } from './components/province/edit/edit.component';
import { RegionCityEditComponent } from './components/city/edit/edit.component';
import { RegionDistrictEditComponent } from './components/district/edit/edit.component';
import { RegionStreetEditComponent } from './components/street/edit/edit.component';
import { RegionVillageEditComponent } from './components/village/edit/edit.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
@NgModule({
  declarations: [
    RegionComponent,
    RegionProvinceEditComponent,
    RegionCityEditComponent,
    RegionDistrictEditComponent,
    RegionStreetEditComponent,
    RegionVillageEditComponent,
  ],
  imports: [
    RegionManagementRoutingModule,
    CoreModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzIconModule,
    DelonACLModule,
    PageHeaderModule,
    NzTreeModule,
    NzGridModule,
    NzSpinModule,
    NzButtonModule,
    STModule,
  ],
  exports: [RegionComponent],
})
export class RegionManagementModule {}
