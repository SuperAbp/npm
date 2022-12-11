import { NgModule } from '@angular/core';
import { MenuManagementComponent } from './components/menu-management.component';
import { MenuManagementEditComponent } from './components/edit/edit.component';
import { MenuManagementRoutingModule } from './menu-management-routing.module';
import { CoreModule } from '@abp/ng.core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { PageHeaderModule } from '@delon/abc/page-header';
import { DelonFormModule } from '@delon/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [MenuManagementComponent, MenuManagementEditComponent],
  imports: [
    MenuManagementRoutingModule,
    CoreModule,
    NzSpinModule,
    NzTreeSelectModule,
    NzFormModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzInputModule,
    NzInputNumberModule,
    NzMessageModule,
    STModule,
    SVModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    PageHeaderModule,
    DelonFormModule.forRoot(),
  ],
  exports: [MenuManagementComponent],
})
export class MenuManagementModule {}
