/* eslint-disable import/order */
/* eslint-disable import/no-duplicates */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ErrorHandler,
  Injector,
  LOCALE_ID,
  NgModule,
  Type,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { default as ngLang } from '@angular/common/locales/zh';
import { Observable } from 'rxjs';
import {
  ALAIN_I18N_TOKEN,
  DELON_LOCALE,
  zh_CN as delonLang,
} from '@delon/theme';

// #region default language
// Reference: https://ng-alain.com/docs/i18n
import { I18NService } from '@core';

import { zhCN as dateLang } from 'date-fns/locale';
import {
  NZ_DATE_LOCALE,
  NZ_I18N,
  zh_CN as zorroLang,
} from 'ng-zorro-antd/i18n';
const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang,
};
// register angular
import { registerLocaleData } from '@angular/common';
registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: NZ_DATE_LOCALE, useValue: LANG.date },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
// #endregion

// #region i18n services

const I18NSERVICE_PROVIDES = [
  { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
];

// #endregion

// #region JSON Schema form (using @delon/form)
import { JsonSchemaModule } from '@shared';
const FORM_MODULES = [JsonSchemaModule];
// #endregion

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from '@core';
import { JWTInterceptor } from '@delon/auth';
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
];
// #endregion

// #region global third module
const GLOBAL_THIRD_MODULES: Array<Type<void>> = [];
// #endregion

// #region Startup Service
import { StartupService } from '@core';
export function StartupServiceFactory(
  startupService: StartupService
): () => Observable<void> {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];
// #endregion

import { CoreModule as AbpCoreModule } from '@abp/ng.core';
import { environment } from '@env/environment';
import { registerLocale } from '@abp/ng.core/locale';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GlobalConfigModule } from './global-config.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { STWidgetModule } from './shared/st-widget/st-widget.module';
import { NgAbpErrorHandler } from './core/error.handler';
import { SettingManagementConfigModule } from '@super-abp/ng.setting-management/config';
import { AbpOAuthModule } from '@abp/ng.oauth';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GlobalConfigModule.forRoot(),
    CoreModule,
    AbpCoreModule.forRoot({
      environment,
      registerLocaleFn: registerLocale(),
    }),
    AbpOAuthModule.forRoot(),
    SettingManagementConfigModule.forRoot(),
    SharedModule,
    LayoutModule,
    RoutesModule,
    STWidgetModule,
    NzMessageModule,
    NzNotificationModule,
    ...FORM_MODULES,
    ...GLOBAL_THIRD_MODULES,
  ],
  exports: [AbpCoreModule],
  providers: [
    ...LANG_PROVIDES,
    ...INTERCEPTOR_PROVIDES,
    ...I18NSERVICE_PROVIDES,
    ...APPINIT_PROVIDES,
    { provide: ErrorHandler, useClass: NgAbpErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
