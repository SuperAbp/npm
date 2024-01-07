import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutBasicComponent } from '../layout';
import { identityEntityPropContributors } from '../components/entity-prop-contributors';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'identity',
        loadChildren: () =>
          import('@super-abp/ng.identity').then((m) =>
            m.IdentityModule.forLazy({
              entityPropContributors: identityEntityPropContributors,
            })
          ),
      },
      {
        path: 'menu-management',
        loadChildren: () =>
          import('@super-abp/ng.menu-management').then((m) => m.routes),
      },
      {
        path: 'audit-logging',
        loadChildren: () =>
          import('@super-abp/ng.audit-logging').then((m) => m.routes),
      },
      {
        path: 'setting-management',
        loadChildren: () =>
          import('@super-abp/ng.setting-management').then((m) => m.routes),
      },
      {
        path: 'region-management',
        loadChildren: () =>
          import('@super-abp/ng.region-management').then((m) => m.routes),
      },
    ],
  },
  // passport
  {
    path: '',
    loadChildren: () => import('./passport/routes').then((m) => m.routes),
  },
  {
    path: 'exception',
    loadChildren: () => import('./exception/routes').then((m) => m.routes),
  },
  { path: '**', redirectTo: 'exception/404' },
];
