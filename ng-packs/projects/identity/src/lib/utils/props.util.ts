import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Injector } from '@angular/core';
import {
  PropContributorCallback,
  PropList,
  PropsFactory,
} from '../models/props';

export function mergeWithDefaultProps<F extends PropsFactory<any>>(
  extension: F,
  defaultProps,
  ...contributors
) {
  Object.keys(defaultProps).forEach((name: string) => {
    const props = extension.get(name);
    props.clearContributors();
    props.addContributor((propList: PropList) =>
      propList.addManyTail(defaultProps[name])
    );
    contributors.forEach((contributor) =>
      (contributor[name] || []).forEach(
        (callback: PropContributorCallback<any>) =>
          props.addContributor(callback)
      )
    );
  });
}
