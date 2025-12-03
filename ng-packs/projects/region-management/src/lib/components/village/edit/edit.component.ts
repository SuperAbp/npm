import { CoreModule, LocalizationService } from '@abp/ng.core';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GetVillageForEditorOutput,
  VillageAdminService,
} from '@super-abp/ng.region-management/proxy';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize, tap } from 'rxjs';

@Component({
    selector: 'super-abp-region-village-edit',
    templateUrl: './edit.component.html',
    imports: [
        CoreModule,
        NzFormModule,
        NzInputModule,
        NzSpinModule,
        NzButtonModule,
    ]
})
export class RegionVillageEditComponent {
  @Input()
  id: string;
  @Input()
  provinceId: string;
  @Input()
  cityId: string;
  @Input()
  districtId: string;
  @Input()
  streetId: string;

  private modal = inject(NzModalRef);
  private fb = inject(FormBuilder);
  private villageService = inject(VillageAdminService);
  village: GetVillageForEditorOutput;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  ngOnInit(): void {
    this.loading = true;
    if (this.id) {
      this.villageService
        .getEditor(this.id)
        .pipe(
          tap((response) => {
            this.village = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.village = {} as GetVillageForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.village.name || '', [Validators.required]],
      code: [this.village.code || '', [Validators.required]],
      alias: [this.village.alias || ''],
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
      this.villageService
        .update(this.id, {
          ...this.village,
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
      this.villageService
        .create({
          ...this.form.value,
          provinceId: this.provinceId,
          cityId: this.cityId,
          districtId: this.districtId,
          streetId: this.streetId,
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
