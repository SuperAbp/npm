import { STData } from '@delon/abc/st';
import { eIdentityComponents } from '../enums/components';
import { PropContributorCallback } from './props';

export type EntityPropContributors = Partial<{
  [eIdentityComponents.Roles]: PropContributorCallback<STData>[];
  [eIdentityComponents.Users]: PropContributorCallback<STData>[];
}>;

export type IdentityEntityPropContributors = Partial<{
  [eIdentityComponents.Roles]: PropContributorCallback<STData>[];
  [eIdentityComponents.Users]: PropContributorCallback<STData>[];
}>;

export interface IdentityConfigOptions {
  entityPropContributors?: IdentityEntityPropContributors;
}
