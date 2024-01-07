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
    issuer: 'https://localhost:44396/',
    redirectUri: baseUrl,
    clientId: 'Demo_App',
    responseType: 'code',
    scope: 'offline_access Demo',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44396',
      rootNamespace: 'SuperAbp.Demo',
    },
  },
  resource: {
    mediaUrl: 'https://localhost:44388/api/super-abp/media',
    userUrl: 'https://passport.lzez.com.cn',
    erpUrl: 'https://erp.ahsanle.cn/',
  },
  identity: {
    url: 'https://passport.lzez.com.cn',
    loginCallback:
      'ejaLfSbcqezvj9WGUAxoCzq+GvfAAiXWu/38eLB9fsWP2rA/H6eh4b2Ugp1sUF6v',
    logoutCallback: 'ejaLfSbcqezvj9WGUAxoC8aQim04tniO',
  },
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
  },
  production: false,
  useHash: true,
} as Environment;
