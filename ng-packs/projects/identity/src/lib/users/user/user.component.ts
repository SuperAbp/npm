import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';
import { IdentityUserEditComponent } from './edit/edit.component';
import { SFSchema } from '@delon/form';
import {
  GetIdentityUsersInput,
  IdentityUserDto,
  IdentityUserService,
} from '../../proxy';

@Component({
  selector: 'snow-users',
  templateUrl: './user.component.html',
})
export class IdentityUserComponent implements OnInit {
  users: IdentityUserDto[];
  total: number;
  loading = false;
  params: GetIdentityUsersInput = this.resetParameters();
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema = {
    properties: {
      filter: {
        type: 'string',
        title: this.localizationService.instant('AbpIdentity::Filter'),
        placeholder: this.localizationService.instant(
          'AbpIdentity::PlaceHolder',
          this.localizationService.instant('AbpIdentity::Filter')
        ),
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    {
      title: this.localizationService.instant('AbpIdentity::UserName'),
      index: 'userName',
    },
    {
      title: this.localizationService.instant('AbpIdentity::EmailAddress'),
      index: 'email',
    },
    {
      title: this.localizationService.instant('AbpIdentity::PhoneNumber'),
      index: 'phoneNumber',
    },
    {
      title: this.localizationService.instant('AbpIdentity::Actions'),
      buttons: [
        {
          icon: 'edit',
          type: 'modal',
          tooltip: this.localizationService.instant('AbpIdentity::Edit'),
          modal: {
            component: IdentityUserEditComponent,
            params: (record: any) => ({
              userId: record.id,
            }),
          },
          iif: () => {
            return this.permissionService.getGrantedPolicy(
              'AbpIdentity.Users.Update'
            );
          },
          click: 'reload',
        },
      ],
    },
  ];

  constructor(
    private modal: ModalHelper,
    private localizationService: LocalizationService,
    private userService: IdentityUserService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.getList();
  }
  getList() {
    this.loading = true;
    this.userService
      .getList(this.params)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(
        (response) => (
          (this.users = response.items), (this.total = response.totalCount)
        )
      );
  }
  /**
   * 重置查询参数
   *
   * @return {*}  {GetProductsInput}
   * @memberof ProductManagementProductComponent
   */
  resetParameters(): GetIdentityUsersInput {
    return {
      filter: '',
      skipCount: 0,
      maxResultCount: 10,
      sorting: 'Id Desc',
    };
  }
  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.skipCount = (e.pi - 1) * e.ps;
      this.params.maxResultCount = e.ps;
      this.getList();
    } else if (e.type === 'sort') {
      this.params.sorting = e.sort.column.index[0];
      this.getList();
    }
  }

  reset(e) {
    this.params = this.resetParameters();
    this.getList();
  }
  search(e) {
    if (e.filter) {
      this.params.filter = e.filter;
    }
    this.getList();
  }
  add() {
    this.modal
      .createStatic(IdentityUserEditComponent, { userId: '' })
      .subscribe(() => this.st.reload());
  }
}
