import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityUserComponent } from './components/users/user.component';
import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { IdentityUserEditComponent } from './components/users/edit/edit.component';
import { IdentityRoleEditComponent } from './components/roles/edit/edit.component';

import { PageHeaderModule } from '@delon/abc/page-header';
import { DelonACLModule } from '@delon/acl';
import { AlainThemeModule } from '@delon/theme';
import { DelonFormModule } from '@delon/form';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { IdentityRoleComponent } from './components/roles/role.component';
import { IdentityConfigOptions } from './models/config-options';
import { IDENTITY_ENTITY_PROP_CONTRIBUTORS } from './tokens';
import { IdentityExtensionsGuard } from './guards';

@NgModule({
  declarations: [
    IdentityUserComponent,
    IdentityUserEditComponent,
    IdentityRoleComponent,
    IdentityRoleEditComponent,
  ],
  imports: [
    IdentityRoutingModule,
    CommonModule,
    CoreModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    PageHeaderModule,
    DelonFormModule.forRoot(),
    STModule,
    SVModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzCardModule,
    NzMessageModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzModalModule,
    NzTabsModule,
    NzIconModule,
    NzDividerModule,
    NzSwitchModule,
    NzRadioModule,
    NzCheckboxModule,
  ],
  exports: [
    IdentityUserComponent,
    IdentityUserEditComponent,
    IdentityRoleComponent,
    IdentityRoleEditComponent,
  ],
})
export class IdentityModule {
  static forChild(
    options: IdentityConfigOptions = {}
  ): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [
        {
          provide: IDENTITY_ENTITY_PROP_CONTRIBUTORS,
          useValue: options.entityPropContributors,
        },
        IdentityExtensionsGuard,
      ],
    };
  }
  static forLazy(
    options: IdentityConfigOptions = {}
  ): NgModuleFactory<IdentityModule> {
    return new LazyModuleFactory(IdentityModule.forChild(options));
  }
}
