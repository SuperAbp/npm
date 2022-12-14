import {
  PagedAndSortedResultRequestDto,
  LocalizationService,
  PermissionService,
} from '@abp/ng.core';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';
import {
  IdentityRoleDto,
  IdentityRoleService,
} from '@super-abp/ng.identity/proxy';
import { PermissionManagementComponent } from '@super-abp/ng.permission-management';
import { ExtensionsService } from '../../services/extensions.service';
import { eIdentityComponents } from '../../enums';
import { IdentityRoleEditComponent } from './edit/edit.component';
@Component({
  selector: 'super-abp-roles',
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
  columns: STColumn[];

  constructor(
    private modal: ModalHelper,
    private injector: Injector,
    private localizationService: LocalizationService,
    private roleService: IdentityRoleService,
    private permissionService: PermissionService,
    private extensionsService: ExtensionsService
  ) {
    const propList = this.extensionsService.entityProps
      .get(eIdentityComponents.Roles)
      .init(injector).props;
    let props = propList.toArray();
    props.push({
      title: localizationService.instant('AbpIdentity::Actions'),
      buttons: [
        {
          icon: 'edit',
          type: 'modal',
          tooltip: localizationService.instant('AbpIdentity::Edit'),
          modal: {
            component: IdentityRoleEditComponent,
            params: (record: IdentityRoleDto) => ({
              roleId: record.id,
            }),
          },
          iif: () => {
            return permissionService.getGrantedPolicy(
              'AbpIdentity.Roles.Update'
            );
          },
          click: 'reload',
        },
        {
          text: localizationService.instant('AbpIdentity::Permissions'),
          type: 'modal',
          tooltip: localizationService.instant('AbpIdentity::Permissions'),
          modal: {
            component: PermissionManagementComponent,
            params: (record: IdentityRoleDto) => ({
              providerName: 'R',
              providerKey: record.name,
            }),
          },
          iif: () => {
            return permissionService.getGrantedPolicy(
              'AbpIdentity.Roles.ManagePermissions'
            );
          },
          click: 'reload',
        },
      ],
    });
    this.columns = props;
  }

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
   * ??????????????????
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
