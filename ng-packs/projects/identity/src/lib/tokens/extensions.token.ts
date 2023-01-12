import { InjectionToken } from '@angular/core';
import { EntityPropContributors } from '../models/config-options';

export const IDENTITY_ENTITY_PROP_CONTRIBUTORS =
  new InjectionToken<EntityPropContributors>(
    'IDENTITY_ENTITY_PROP_CONTRIBUTORS'
  );
