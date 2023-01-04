import { NgModule } from '@angular/core';
import { SettingManagementComponent } from './components/setting-management.component';
import { PageHeaderModule } from '@delon/abc/page-header';
import { SettingManagementRoutingModule } from './setting-management-routing.module';
import { CoreModule } from '@abp/ng.core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { DelonACLModule } from '@delon/acl';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [SettingManagementComponent],
  imports: [
    SettingManagementRoutingModule,
    CoreModule,
    NzTabsModule,
    NzCardModule,
    DelonACLModule,
    PageHeaderModule,
  ],
  exports: [SettingManagementComponent],
})
export class SettingManagementModule {}
