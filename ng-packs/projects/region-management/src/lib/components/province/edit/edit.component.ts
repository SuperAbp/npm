import { CoreModule, LocalizationService } from '@abp/ng.core';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STModule } from '@delon/abc/st';
import {
  GetProvinceForEditorOutput,
  ProvinceAdminService,
} from '@super-abp/ng.region-management/proxy';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { finalize, tap } from 'rxjs';

@Component({
    selector: 'super-abp-region-province-edit',
    templateUrl: './edit.component.html',
    imports: [
        CoreModule,
        NzFormModule,
        NzInputModule,
        NzSpinModule,
        NzButtonModule,
    ]
})
export class RegionProvinceEditComponent {
  @Input()
  id: string;
  private modal = inject(NzModalRef);
  private fb = inject(FormBuilder);
  private provinceService = inject(ProvinceAdminService);
  province: GetProvinceForEditorOutput;

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

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
