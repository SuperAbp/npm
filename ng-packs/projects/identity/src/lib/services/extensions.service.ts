import { Injectable } from '@angular/core';
import { EntityPropsFactory } from '../models/entity-props';

@Injectable({
  providedIn: 'root',
})
export class ExtensionsService<R = any> {
  readonly entityProps = new EntityPropsFactory<R>();
}
