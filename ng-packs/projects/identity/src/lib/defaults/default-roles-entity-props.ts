import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Injector } from '@angular/core';
import { STData } from '@delon/abc/st';

export function GET_DEFAULT_ROLES_ENTITY_PROPS(injector: Injector): STData[] {
  const localizationService = injector.get(LocalizationService);
  return [
    {
      title: localizationService.instant('AbpIdentity::RoleName'),
      index: 'name',
    },
  ];
}
