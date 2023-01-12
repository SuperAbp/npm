import { Type } from '@angular/core';
import { PropList, Props, PropsFactory } from './props';

export class EntityPropList<R = any> extends PropList<R> {}

export class EntityProps<R = any> extends Props<EntityPropList<R>> {
  protected _ctor: Type<EntityPropList<R>> = EntityPropList;
}

export class EntityPropsFactory<R = any> extends PropsFactory<EntityProps<R>> {
  protected _ctor: Type<EntityProps<R>> = EntityProps;
}
