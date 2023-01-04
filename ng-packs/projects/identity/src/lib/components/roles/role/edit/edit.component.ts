import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs/operators';
import { IdentityRoleDto, IdentityRoleService } from '../../../../proxy';

@Component({
  selector: 'snow-roles-edit',
  templateUrl: './edit.component.html',
})
export class IdentityRoleEditComponent implements OnInit {
  @Input()
  roleId: string;
  role: IdentityRoleDto;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private roleService: IdentityRoleService
  ) {}

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
      this.role = {
        isDefault: false,
        isStatic: false,
        isPublic: false,
        id: null,
        extraProperties: null,
      };
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
