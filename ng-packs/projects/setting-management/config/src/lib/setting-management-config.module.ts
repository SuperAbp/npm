import { ModuleWithProviders, NgModule } from '@angular/core';
import { CoreModule } from '@abp/ng.core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EmailSettingGroupComponent } from './components/email-setting-group.component';
import {
  SETTING_MANAGEMENT_ROUTE_PROVIDERS,
  SETTING_MANAGEMENT_SETTING_TAB_PROVIDERS,
  SETTING_MANAGEMENT_VISIBLE_PROVIDERS,
} from './providers';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SETTING_MANAGEMENT_FEATURES_PROVIDERS } from './providers/features.token';

@NgModule({
  declarations: [EmailSettingGroupComponent],
  imports: [
    CoreModule,
    NzModalModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzCheckboxModule,
    NzMessageModule,
    NzIconModule,
    NzSpinModule,
  ],
  exports: [EmailSettingGroupComponent],
})
export class SettingManagementConfigModule {
  static forRoot(): ModuleWithProviders<SettingManagementConfigModule> {
    return {
      ngModule: SettingManagementConfigModule,
      providers: [
        SETTING_MANAGEMENT_SETTING_TAB_PROVIDERS,
        SETTING_MANAGEMENT_FEATURES_PROVIDERS,
        SETTING_MANAGEMENT_VISIBLE_PROVIDERS,
      ],
    };
  }
}
