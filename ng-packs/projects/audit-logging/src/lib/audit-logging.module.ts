import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { AuditLoggingRoutingModule } from './audit-logging.module-routing.module';
import { AuditLoggingComponent } from './components/audit-logging.component';
import { AuditLoggingViewComponent } from './components/view/view.component';

@NgModule({
  declarations: [AuditLoggingComponent, AuditLoggingViewComponent],
  imports: [
    AuditLoggingRoutingModule,
    CoreModule,
    NzSpinModule,
    NzButtonModule,
    NzCardModule,
    STModule,
    SVModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    PageHeaderModule,
    NzDescriptionsModule,
    DelonFormModule.forRoot(),
    NzBadgeModule,
  ],
  exports: [AuditLoggingComponent],
})
export class AuditLoggingModule {}
