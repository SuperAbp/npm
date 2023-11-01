import { LocalizationService } from '@abp/ng.core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GetStreetForEditorOutput,
  StreetAdminService,
} from '@super-abp/ng.region-management/proxy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'super-abp-region-street-edit',
  templateUrl: './edit.component.html',
})
export class RegionStreetEditComponent {
  @Input()
  id: string;
  @Input()
  provinceId: string;
  @Input()
  cityId: string;
  @Input()
  districtId: string;

  street: GetStreetForEditorOutput;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private streetService: StreetAdminService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.id) {
      this.streetService
        .getEditor(this.id)
        .pipe(
          tap((response) => {
            this.street = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.street = {} as GetStreetForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.street.name || '', [Validators.required]],
      code: [this.street.code || '', [Validators.required]],
      alias: [this.street.alias || ''],
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
      this.streetService
        .update(this.id, {
          ...this.street,
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
      this.streetService
        .create({
          ...this.form.value,
          provinceId: this.provinceId,
          cityId: this.cityId,
          districtId: this.districtId,
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
