import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PermissionManagementComponent } from './components/permission-management.component';

@NgModule({
  declarations: [PermissionManagementComponent],
  imports: [CoreModule, NzButtonModule, NzTreeModule, NzSpinModule],
  exports: [PermissionManagementComponent],
})
export class PermissionManagementModule {}
