import { APP_INITIALIZER, Injector } from '@angular/core';
import { combineLatest } from 'rxjs';
import { RoutesService } from '@abp/ng.core';
import { SETTING_MANAGEMENT_HAS_SETTING } from './route.provider';
import { SETTING_MANAGEMENT_ROUTE_VISIBILITY } from './features.token';
import { eSettingManagementRouteNames } from '../enums';
import { MenuService } from '@delon/theme';

export const SETTING_MANAGEMENT_VISIBLE_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: setSettingManagementVisibility,
    deps: [Injector],
    multi: true,
  },
];

export function setSettingManagementVisibility(injector: Injector) {
  return () => {
    const settingManagementHasSetting$ = injector.get(
      SETTING_MANAGEMENT_HAS_SETTING
    );
    const isSettingManagementFeatureEnable$ = injector.get(
      SETTING_MANAGEMENT_ROUTE_VISIBILITY
    );
    const menus = injector.get(MenuService);
    combineLatest([
      settingManagementHasSetting$,
      isSettingManagementFeatureEnable$,
    ]).subscribe(
      ([settingManagementHasSetting, isSettingManagementFeatureEnable]) => {
        menus.setItem(eSettingManagementRouteNames.Settings, {
          hide: !(
            settingManagementHasSetting && isSettingManagementFeatureEnable
          ),
        });
      }
    );
  };
}
