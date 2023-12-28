import { CoreModule, LocalizationService } from '@abp/ng.core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CityAdminService,
  GetCityForEditorOutput,
  ProvinceListDto,
} from '@super-abp/ng.region-management/proxy';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'super-abp-region-city-edit',
  templateUrl: './edit.component.html',
  standalone: true,
  imports: [
    CoreModule,
    NzFormModule,
    NzInputModule,
    NzSpinModule,
    NzButtonModule,
  ],
})
export class RegionCityEditComponent {
  @Input()
  id: string;
  @Input()
  provinceId: string;
  city: GetCityForEditorOutput;
  provinces: ProvinceListDto[];

  loading = false;
  isConfirmLoading = false;
  loadingProvince = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private fb: FormBuilder,
    private cityService: CityAdminService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.id) {
      this.cityService
        .getEditor(this.id)
        .pipe(
          tap((response) => {
            this.city = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.city = {} as GetCityForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.city.name || '', [Validators.required]],
      code: [this.city.code || '', [Validators.required]],
      alias: [this.city.alias || ''],
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
      this.cityService
        .update(this.id, {
          ...this.city,
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
      this.cityService
        .create({
          ...this.form.value,
          provinceId: this.provinceId,
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
