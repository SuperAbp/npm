import {
  PagedAndSortedResultRequestDto,
  LocalizationService,
  PermissionService,
  CoreModule,
} from '@abp/ng.core';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import {
  STChange,
  STColumn,
  STComponent,
  STModule,
  STPage,
} from '@delon/abc/st';
import { DelonFormModule, SFSchema } from '@delon/form';
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
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TreeSelectWidgetModule } from '@delon/form/widgets/tree-select';
import { PageHeaderModule } from '@delon/abc/page-header';
@Component({
  selector: 'super-abp-roles',
  templateUrl: './role.component.html',
  // standalone: true,
  // imports: [
  //   CoreModule,
  //   NzCardModule,
  //   STModule,
  //   NzButtonModule,
  //   NzMessageModule,
  //   TreeSelectWidgetModule,
  //   PageHeaderModule,
  //   DelonFormModule,
  // ],
})
export class IdentityRoleComponent implements OnInit {
  roles: IdentityRoleDto[];
  total: number;
  loading = false;
  params: PagedAndSortedResultRequestDto = this.resetParameters();
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
   * 重置查询参数
   *
   * @return {*}  {GetProductsInput}
   * @memberof ProductManagementProductComponent
   */
  resetParameters(): PagedAndSortedResultRequestDto {
    return {
      skipCount: 0,
      maxResultCount: 10,
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
