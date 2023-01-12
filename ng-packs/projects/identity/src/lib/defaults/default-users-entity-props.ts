import { LocalizationService } from '@abp/ng.core';
import { Injector } from '@angular/core';
import { STData } from '@delon/abc/st';

export function GET_DEFAULT_USERS_ENTITY_PROPS(injector: Injector): STData[] {
  const localizationService = injector.get(LocalizationService);
  return [
    {
      title: localizationService.instant('AbpIdentity::UserName'),
      index: 'userName',
    },
    {
      title: localizationService.instant('AbpIdentity::EmailAddress'),
      index: 'email',
    },
    {
      title: localizationService.instant('AbpIdentity::PhoneNumber'),
      index: 'phoneNumber',
    },
  ];
}
