import { Routes } from '@angular/router';

import { CallbackComponent } from './callback.component';
import { UserLoginComponent } from './login/login.component';
import { LayoutPassportComponent } from '../../layout';

export const routes: Routes = [
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'app.login.login' },
      },
    ],
  },
  // 单页不包裹Layout
  { path: 'passport/callback/:type', component: CallbackComponent },
];
