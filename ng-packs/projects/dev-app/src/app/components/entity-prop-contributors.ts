import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Injector } from '@angular/core';
import { STData } from '@delon/abc/st';
import { eIdentityComponents } from 'projects/identity/src/lib/enums';
import { IdentityEntityPropContributors } from 'projects/identity/src/lib/models/config-options';
import { EntityPropList } from 'projects/identity/src/lib/models/entity-props';

export function namePropContributor(
  propList: EntityPropList<STData>,
  injector: Injector
) {
  const localizationService = injector.get(LocalizationService);
  propList.addAfter(
    {
      title: localizationService.instant('AbpIdentity::RoleName'),
      index: 'concurrencyStamp',
    },
    'userName',
    (value, name) => value['index'] == name
  );
}

export const identityEntityPropContributors: IdentityEntityPropContributors = {
  // enum indicates the page to add contributors to
  [eIdentityComponents.Users]: [
    namePropContributor,
    // You can add more contributors here
  ],
};
