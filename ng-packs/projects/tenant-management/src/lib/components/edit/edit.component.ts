import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs/operators';
import { CoreModule } from '@abp/ng.core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import {
  TenantCreateOrUpdateDtoBase,
  TenantDto,
  TenantService,
} from '@super-abp/ng.tenant-management/proxy';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'super-abp-tenants-edit',
  templateUrl: './edit.component.html',
  imports: [
    CoreModule,
    NzSpinModule,
    NzFormModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputModule,
    NzIconModule,
  ],
})
export class TenantManagementEditComponent implements OnInit {
  @Input()
  tenantId: string;

  private modal = inject(NzModalRef);
  private fb = inject(FormBuilder);
  private tenantService = inject(TenantService);

  tenant: TenantDto;

  loading = false;
  isConfirmLoading = false;
  passwordVisible = false;
  password?: string;
  form: FormGroup = null;

  ngOnInit(): void {
    this.loading = true;
    if (this.tenantId) {
      this.tenantService
        .get(this.tenantId)
        .pipe(
          tap((response) => {
            this.tenant = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.tenant = {} as TenantCreateOrUpdateDtoBase;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        this.tenant.name || '',
        [Validators.required, Validators.maxLength(256)],
      ],
      adminEmailAddress: ['', [Validators.required, Validators.maxLength(256)]],
      adminPassword: ['', [Validators.required, Validators.maxLength(256)]],
      concurrencyStamp: [this.tenant.concurrencyStamp || ''],
    });
    if (this.tenantId) {
      this.form.get('adminEmailAddress').disable();
      this.form.get('adminPassword').disable();
    } else {
      this.form.get('concurrencyStamp').disable();
    }
  }

  save() {
    if (!this.form.valid || this.isConfirmLoading) {
      for (const key of Object.keys(this.form.controls)) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
      return;
    }
    this.isConfirmLoading = true;
    if (this.tenantId) {
      this.tenantService
        .update(this.tenantId, {
          name: this.form.get('name').value,
          concurrencyStamp: this.form.get('concurrencyStamp').value,
        })
        .pipe(finalize(() => (this.isConfirmLoading = false)))
        .subscribe(() => {
          this.modal.close(true);
        });
    } else {
      this.tenantService
        .create({
          name: this.form.get('name').value,
          adminEmailAddress: this.form.get('adminEmailAddress').value,
          adminPassword: this.form.get('adminPassword').value,
        })
        .pipe(finalize(() => (this.isConfirmLoading = false)))
        .subscribe(() => {
          this.modal.close(true);
        });
    }
  }

  close() {
    this.modal.destroy();
  }
}
