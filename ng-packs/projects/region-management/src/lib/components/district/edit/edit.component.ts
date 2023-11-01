import { LocalizationService } from '@abp/ng.core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DistrictAdminService,
  GetCityForEditorOutput,
  GetDistrictForEditorOutput,
} from '@super-abp/ng.region-management/proxy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'super-abp-region-district-edit',
  templateUrl: './edit.component.html',
})
export class RegionDistrictEditComponent {
  @Input()
  id: string;
  @Input()
  provinceId: string;
  @Input()
  cityId: string;
  district: GetDistrictForEditorOutput;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private districtService: DistrictAdminService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.id) {
      this.districtService
        .getEditor(this.id)
        .pipe(
          tap((response) => {
            this.district = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.district = {} as GetCityForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.district.name || '', [Validators.required]],
      code: [this.district.code || '', [Validators.required]],
      alias: [this.district.alias || ''],
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
      this.districtService
        .update(this.id, {
          ...this.district,
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
      this.districtService
        .create({
          ...this.form.value,
          provinceId: this.provinceId,
          cityId: this.cityId,
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
