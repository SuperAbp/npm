import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs/operators';
import {
  IdentityRoleDto,
  IdentityRoleService,
} from '@super-abp/ng.identity/proxy';
import { CoreModule } from '@abp/ng.core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';

@Component({
    selector: 'super-abp-roles-edit',
    templateUrl: './edit.component.html',
    standalone: false
})
export class IdentityRoleEditComponent implements OnInit {
  @Input()
  roleId: string;

  private modal = inject(NzModalRef);
  private fb = inject(FormBuilder);
  private roleService = inject(IdentityRoleService);

  role: IdentityRoleDto;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  ngOnInit(): void {
    this.loading = true;
    if (this.roleId) {
      this.roleService
        .get(this.roleId)
        .pipe(
          tap((response) => {
            this.role = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.role = {} as IdentityRoleDto;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [
        this.role.name || '',
        [Validators.required, Validators.maxLength(256)],
      ],
      isDefault: [this.role.isDefault || false],
      isStatic: [this.role.isStatic || false],
      isPublic: [this.role.isPublic || false],
    });
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
    if (this.roleId) {
      this.roleService
        .update(this.roleId, {
          ...this.role,
          ...this.form.value,
        })
        .pipe(finalize(() => (this.isConfirmLoading = false)))
        .subscribe(() => {
          this.modal.close(true);
        });
    } else {
      this.roleService
        .create({ ...this.form.value })
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
