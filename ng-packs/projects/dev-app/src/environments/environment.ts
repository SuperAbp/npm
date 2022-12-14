// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { DelonMockModule } from '@delon/mock';
import { Environment } from '../Environment';


const baseUrl = 'http://localhost:4200';
export const environment = {
  application: {
    baseUrl,
    name: '123',
    logoUrl: ''
  },
  oAuthConfig: {
    issuer: 'https://localhost:44388/',
    redirectUri: baseUrl,
      clientId: 'Exam_Admin_App',
      responseType: 'code',
      scope: 'offline_access Exam',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44388',
      rootNamespace: 'Lzez.Exam'
    }
  },
  resource: {
    mediaUrl: 'https://localhost:44388/api/super-abp/media',
    userUrl: 'https://passport.lzez.com.cn',
    erpUrl: 'https://erp.ahsanle.cn/'
  },
  identity: {
    url: 'https://passport.lzez.com.cn',
    loginCallback: 'ejaLfSbcqezvj9WGUAxoCzq+GvfAAiXWu/38eLB9fsWP2rA/H6eh4b2Ugp1sUF6v',
    logoutCallback: 'ejaLfSbcqezvj9WGUAxoC8aQim04tniO'
  },
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  production: false,
  useHash: true,
} as Environment;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
