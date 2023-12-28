import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PermissionManagementComponent } from './components/permission-management.component';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [PermissionManagementComponent],
  imports: [
    CoreModule,
    NzButtonModule,
    NzTreeModule,
    NzCardModule,
    NzSpinModule,
    NzModalModule,
  ],
  exports: [PermissionManagementComponent],
})
export class PermissionManagementModule {}
