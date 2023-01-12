import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Injectable, Injector } from '@angular/core';
import { CanActivate } from '@angular/router';
import { GET_DEFAULT_ROLES_ENTITY_PROPS } from '../defaults/default-roles-entity-props';
import { GET_DEFAULT_USERS_ENTITY_PROPS } from '../defaults/default-users-entity-props';
import { eIdentityComponents } from '../enums';
import { IdentityEntityPropContributors } from '../models/config-options';
import { PropContributorCallback, PropList } from '../models/props';
import { ExtensionsService } from '../services/extensions.service';
import { IDENTITY_ENTITY_PROP_CONTRIBUTORS } from '../tokens';
import { mergeWithDefaultProps } from '../utils/props.util';

@Injectable()
export class IdentityExtensionsGuard implements CanActivate {
  constructor(private injector: Injector) {}

  canActivate(): boolean {
    const extensions: ExtensionsService = this.injector.get(ExtensionsService);
    const localizationService = this.injector.get(LocalizationService);
    const permissionService = this.injector.get(PermissionService);
    const propContributors: IdentityEntityPropContributors =
      this.injector.get(IDENTITY_ENTITY_PROP_CONTRIBUTORS, null) || {};
    const userColumns = GET_DEFAULT_USERS_ENTITY_PROPS(this.injector);
    const roleColumns = GET_DEFAULT_ROLES_ENTITY_PROPS(this.injector);
    var defaultProps = {
      [eIdentityComponents.Roles]: roleColumns,
      [eIdentityComponents.Users]: userColumns,
    };
    mergeWithDefaultProps(
      extensions.entityProps,
      defaultProps,
      propContributors
    );
    // Object.keys(defaultProps).forEach((name: string) => {
    //   const props = extensions.entityProps.get(name);
    //   props.clearContributors();
    //   props.addContributor((propList: PropList) =>
    //     propList.addManyTail(defaultProps[name])
    //   );
    //   [...propContributors].forEach((contributor) =>
    //     (contributor[name] || []).forEach(
    //       (callback: PropContributorCallback<any>) =>
    //         props.addContributor(callback)
    //     )
    //   );
    // });

    return true;
  }
}
