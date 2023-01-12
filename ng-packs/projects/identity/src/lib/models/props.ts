import { LocalizationService, PermissionService } from '@abp/ng.core';
import { LinkedList } from '@abp/utils';
import { Inject, Injector, Type } from '@angular/core';

export abstract class PropList<R = any> extends LinkedList<R> {}

export abstract class PropsFactory<C> {
  protected abstract _ctor: Type<C>;
  private contributorCallbacks: PropContributorCallbacks<C> = {};

  get(name: string): C {
    this.contributorCallbacks[name] = this.contributorCallbacks[name] || [];

    return new this._ctor(this.contributorCallbacks[name]);
  }
}
export abstract class Props<L> {
  protected abstract _ctor: Type<L>;
  private injector: Injector;
  get props(): L {
    const propList = new this._ctor();
    this.callbackList.forEach((callback) => callback(propList, this.injector));

    return propList;
  }

  constructor(private readonly callbackList: PropContributorCallback<L>[]) {}

  init(injector: Injector) {
    this.injector = injector;
    return this;
  }

  addContributor(contributeCallback: PropContributorCallback<L>) {
    this.callbackList.push(contributeCallback);
  }

  clearContributors() {
    while (this.callbackList.length) this.callbackList.pop();
  }
}
export type PropContributorCallbacks<L> = Record<
  string,
  PropContributorCallback<L>[]
>;

export type PropContributorCallback<L> = (
  propList: L,
  injector: Injector
) => any;
