import { LocalizationService } from '@abp/ng.core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GetProvinceForEditorOutput,
  ProvinceAdminService,
} from '@super-abp/ng.region-management/proxy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'super-abp-region-province-edit',
  templateUrl: './edit.component.html',
})
export class RegionProvinceEditComponent {
  @Input()
  id: string;
  province: GetProvinceForEditorOutput;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private provinceService: ProvinceAdminService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.id) {
      this.provinceService
        .getEditor(this.id)
        .pipe(
          tap((response) => {
            this.province = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.province = {} as GetProvinceForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.province.name || '', [Validators.required]],
      code: [this.province.code || '', [Validators.required]],
      alias: [this.province.alias || ''],
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
    if (this.id) {
      this.provinceService
        .update(this.id, {
          ...this.province,
          ...this.form.value,
        })
        .pipe(
          tap((response) => {
            this.modal.close(true);
          }),
          finalize(() => (this.isConfirmLoading = false))
        )
        .subscribe();
    } else {
      this.provinceService
        .create({
          ...this.form.value,
        })
        .pipe(
          tap((response) => {
            this.modal.close(true);
          }),
          finalize(() => (this.isConfirmLoading = false))
        )
        .subscribe();
    }
  }

  close() {
    this.modal.destroy();
  }
}
