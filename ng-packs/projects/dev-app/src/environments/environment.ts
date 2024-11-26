// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '../Environment';

const baseUrl = 'http://localhost:4200';
export const environment = {
  application: {
    baseUrl,
    name: '123',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44386/',
    redirectUri: baseUrl,
    clientId: 'Exam_Admin_App',
    responseType: 'code',
    scope: 'offline_access Exam',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44388',
      rootNamespace: 'SuperAbp.Demo',
    },
  },
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
  },
  production: false,
  useHash: true,
} as Environment;
