import {
  PagedAndSortedResultRequestDto,
  LocalizationService,
  PermissionService,
} from '@abp/ng.core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';
import { IdentityRoleEditComponent } from './edit/edit.component';
import { IdentityRoleDto, IdentityRoleService } from '../../proxy';
import { PermissionManagementComponent } from '@super-abp/ng.permission-management';
@Component({
  selector: 'snow-roles',
  templateUrl: './role.component.html',
})
export class IdentityRoleComponent implements OnInit {
  roles: IdentityRoleDto[];
  total: number;
  loading = false;
  params: PagedAndSortedResultRequestDto = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'Id Desc',
  };
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema = {
    properties: {},
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    {
      title: this.localizationService.instant('AbpIdentity::RoleName'),
      index: 'name',
    },
    {
      title: this.localizationService.instant('AbpIdentity::Actions'),
      buttons: [
        {
          icon: 'edit',
          type: 'modal',
          tooltip: this.localizationService.instant('AbpIdentity::Edit'),
          modal: {
            component: IdentityRoleEditComponent,
            params: (record: IdentityRoleDto) => ({
              roleId: record.id,
            }),
          },
          iif: () => {
            return this.permissionService.getGrantedPolicy(
              'AbpIdentity.Roles.Update'
            );
          },
          click: 'reload',
        },
        {
          text: this.localizationService.instant('AbpIdentity::Permissions'),
          type: 'modal',
          tooltip: this.localizationService.instant('AbpIdentity::Permissions'),
          modal: {
            component: PermissionManagementComponent,
            params: (record: IdentityRoleDto) => ({
              providerName: 'R',
              providerKey: record.name,
            }),
          },
          iif: () => {
            return this.permissionService.getGrantedPolicy(
              'AbpIdentity.Roles.ManagePermissions'
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
    private roleService: IdentityRoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.getList();
  }
  getList() {
    this.loading = true;
    this.roleService
      .getList(this.params)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(
        (response) => (
          (this.roles = response.items), (this.total = response.totalCount)
        )
      );
  }
  /**
   * 重置查询参数
   *
   * @return {*}  {GetProductsInput}
   * @memberof ProductManagementProductComponent
   */
  resetParameters(): PagedAndSortedResultRequestDto {
    return {
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
  add() {
    this.modal
      .createStatic(IdentityRoleEditComponent, { roleId: '' })
      .subscribe(() => this.st.reload());
  }
}
