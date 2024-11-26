import {
  Component,
  Input,
  OnInit,
  TrackByFunction,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import {
  IdentityRoleDto,
  IdentityRoleService,
  IdentityUserDto,
  IdentityUserService,
} from '@super-abp/ng.identity/proxy';
import { CoreModule } from '@abp/ng.core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'super-abp-identity-users-edit',
  templateUrl: './edit.component.html',
  // standalone: true,
  // imports: [
  //   CoreModule,
  //   NzSpinModule,
  //   NzFormModule,
  //   NzButtonModule,
  //   NzCheckboxModule,
  //   NzInputModule,
  //   NzMessageModule,
  //   NzTabsModule,
  // ],
})
export class IdentityUserEditComponent implements OnInit {
  @Input()
  userId: string;

  private modal = inject(NzModalRef);
  private fb = inject(FormBuilder);
  private roleService = inject(IdentityRoleService);
  private userService = inject(IdentityUserService);

  user: IdentityUserDto;
  roles: IdentityRoleDto[];
  selectedUserRoles: IdentityRoleDto[];
  rolesOption = [];
  loading = false;
  isConfirmLoading = false;
  form: FormGroup;
  trackByFn: TrackByFunction<AbstractControl> = (index, item) =>
    Object.keys(item)[0] || index;

  get roleGroups(): FormGroup[] {
    return (this.form.get('roleNames') as FormArray).controls as FormGroup[];
  }

  ngOnInit(): void {
    this.loading = true;

    if (this.userId) {
      this.userService.get(this.userId).subscribe((userResult) => {
        this.user = userResult;
        this.userService.getRoles(this.userId).subscribe((result) => {
          this.selectedUserRoles = result.items;
          this.buildForm();
          this.loading = false;
        });
      });
    } else {
      this.user = {} as IdentityUserDto;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.roleService.getAllList().subscribe((response) => {
      this.roles = response.items;
      this.form = this.fb.group({
        userName: [
          this.user.userName || '',
          [Validators.required, Validators.maxLength(256)],
        ],
        email: [
          this.user.email || '',
          [Validators.required, Validators.email, Validators.maxLength(256)],
        ],
        name: [this.user.name || '', [Validators.maxLength(64)]],
        surname: [this.user.surname || '', [Validators.maxLength(64)]],
        phoneNumber: [this.user.phoneNumber || '', [Validators.maxLength(16)]],
        lockoutEnabled: [
          this.user.lockoutEnabled || (this.user.id ? false : true),
        ],
        isActive: [this.user.isActive || true],
        password: ['', [Validators.maxLength(64)]],
        roleNames: [
          this.roles.map((role) => {
            return {
              label: role.name,
              value: role.name,
              checked: this.user.id
                ? !!this.selectedUserRoles.find(
                    (userRole) => userRole.id === role.id
                  )
                : role.isDefault,
            };
          }),
        ],
      });
    });

    // TODO:动态创建密码验证规则
    // const passwordValidators = getPasswordValidators(this.store);
    // this.form.addControl('password', new FormControl('', [...passwordValidators]));
    // if (!this.user.userName) {
    //   this.form.get('password').setValidators([...passwordValidators, Validators.required]);
    //   this.form.get('password').updateValueAndValidity();
    // }
  }

  save() {
    if (!this.form.valid || this.isConfirmLoading) {
      return;
    }
    this.isConfirmLoading = true;
    this.userService
      .updateRoles(this.userId, {
        roleNames: (this.form.value.roleNames as any[])
          .filter((r) => r.checked)
          .map((r) => r.value),
      })
      .pipe(finalize(() => (this.isConfirmLoading = false)))
      .subscribe(() => {
        this.modal.close(true);
      });
    // if (this.userId) {
    //   this.userService
    //     .updateByIdAndInput(
    //       new IdentityUserUpdateDto({
    //         ...this.user,
    //         ...this.form.value,
    //       }),
    //       this.userId,
    //     )
    //     .pipe(
    //       tap((response) => {
    //         this.isConfirmLoading = false;

    //         this.modal.close(true);
    //       }),
    //     );
    // } else {
    //   this.userService
    //     .createByInput(
    //       new IdentityUserCreateDto({
    //         ...this.form.value,
    //       }),
    //     )
    //     .pipe(
    //       tap((response) => {
    //         this.isConfirmLoading = false;

    //         this.modal.close(true);
    //       }),
    //     );
    // }
  }

  close() {
    this.modal.close(false);
  }
}
