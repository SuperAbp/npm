import { APP_INITIALIZER } from '@angular/core';
import { SettingTabsService } from '@super-abp/ng.setting-management';
import { EmailSettingGroupComponent } from '../components/email-setting-group.component';

export const SETTING_MANAGEMENT_SETTING_TAB_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: configureSettingTabs,
    deps: [SettingTabsService],
    multi: true,
  },
];

export function configureSettingTabs(settingTabs: SettingTabsService) {
  return () => {
    settingTabs.add([
      {
        name: 'AbpSettingManagement::Menu:Emailing',
        order: 100,
        requiredPolicy: 'SettingManagement.Emailing',
        component: EmailSettingGroupComponent,
      },
    ]);
  };
}
