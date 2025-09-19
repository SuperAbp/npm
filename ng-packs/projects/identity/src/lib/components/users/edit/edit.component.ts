import {
  Component,
  Injector,
  Input,
  OnInit,
  TrackByFunction,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs/operators';
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
import { getPasswordValidators } from '../../../utils/validation-utils';

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

  private readonly injector = inject(Injector);
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
      const passwordValidators = getPasswordValidators(this.injector);
      this.form
        .get('password')
        .setValidators([...passwordValidators, Validators.required]);
      this.form.get('password').updateValueAndValidity();
    });
  }

  save() {
    if (!this.form.valid || this.isConfirmLoading) {
      return;
    }
    this.isConfirmLoading = true;
    let roleNames = (this.form.value.roleNames as any[])
      .filter((r) => r.checked)
      .map((r) => r.value);
    if (this.userId) {
      this.userService
        .update(this.userId, {
          ...this.user,
          ...this.form.value,
          roleNames,
        })
        .pipe(
          tap(() => {
            this.modal.close(true);
          }),
          finalize(() => {
            this.isConfirmLoading = false;
          })
        )
        .subscribe();
    } else {
      this.userService
        .create({
          ...this.form.value,
          roleNames,
        })
        .pipe(
          tap(() => {
            this.modal.close(true);
          }),
          finalize(() => {
            this.isConfirmLoading = false;
          })
        )
        .subscribe();
    }
  }

  close() {
    this.modal.close(false);
  }
}
