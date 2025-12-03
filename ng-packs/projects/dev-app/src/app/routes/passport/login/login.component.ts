import { AuthService } from '@abp/ng.core';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { I18nPipe, _HttpClient } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        ReactiveFormsModule,
        I18nPipe,
        NzCheckboxModule,
        NzTabsModule,
        NzAlertModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzTooltipModule,
        NzIconModule,
    ]
})
export class UserLoginComponent {
  constructor(
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    private oAuthService: OAuthService,
    private authService: AuthService
  ) {
    if (this.hasLoggedIn) {
      this.tokenService.set({
        token: oAuthService.getAccessToken(),
        expired: this.oAuthService.getAccessTokenExpiration(),
      });
      this.startupSrv.load().subscribe(() => {
        let url = this.tokenService.referrer?.url || '/';
        if (url.includes('/passport')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });
    } else {
      this.authService.navigateToLogin();
    }
  }

  // #region fields
  get hasLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
}
