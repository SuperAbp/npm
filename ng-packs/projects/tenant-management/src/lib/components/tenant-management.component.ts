import {
  CoreModule,
  LocalizationService,
  PermissionService,
} from '@abp/ng.core';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  STChange,
  STColumn,
  STComponent,
  STModule,
  STPage,
} from '@delon/abc/st';
import { DelonFormModule, SFSchema } from '@delon/form';
import { ModalHelper } from '@delon/theme';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { TenantManagementEditComponent } from './edit/edit.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  GetTenantsInput,
  TenantDto,
  TenantService,
} from '@super-abp/ng.tenant-management/proxy';

@Component({
  selector: 'super-abp-tenant-management',
  templateUrl: './tenant-management.component.html',
  standalone: true,
  imports: [
    CoreModule,
    NzCardModule,
    STModule,
    NzButtonModule,
    NzMessageModule,
    PageHeaderModule,
    DelonFormModule,
  ],
})
export class TenantManagementComponent implements OnInit {
  private modal = inject(ModalHelper);
  private localizationService = inject(LocalizationService);
  private messageService = inject(NzMessageService);
  private permissionService = inject(PermissionService);
  private tenantService = inject(TenantService);

  tenants: TenantDto[];
  total: number;
  loading = false;
  params: GetTenantsInput = this.resetParameters();
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '',
        ui: {
          placeholder: this.localizationService.instant(
            'AbpTenantManagement::Placeholder',
            this.localizationService.instant('AbpTenantManagement::TenantName')
          ),
        },
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    {
      title: this.localizationService.instant(
        'AbpTenantManagement::TenantName'
      ),
      index: 'name',
    },
    {
      title: this.localizationService.instant('AbpTenantManagement::Actions'),
      buttons: [
        {
          icon: 'edit',
          type: 'modal',
          tooltip: this.localizationService.instant(
            'AbpTenantManagement::Edit'
          ),
          iif: () => {
            return this.permissionService.getGrantedPolicy(
              'AbpTenantManagement.Tenants.Update'
            );
          },
          modal: {
            component: TenantManagementEditComponent,
            params: (record: any) => ({
              tenantId: record.id,
            }),
          },
          click: 'reload',
        },
        {
          icon: 'delete',
          type: 'del',
          tooltip: this.localizationService.instant(
            'AbpTenantManagement::Delete'
          ),
          pop: {
            title: this.localizationService.instant(
              'AbpTenantManagement::AreYouSure'
            ),
            okType: 'danger',
            icon: 'star',
          },
          iif: () => {
            return this.permissionService.getGrantedPolicy(
              'AbpTenantManagement.Tenants.Delete'
            );
          },
          click: (record, _modal, component) => {
            this.tenantService.delete(record.id).subscribe((response) => {
              this.messageService.success(
                this.localizationService.instant(
                  'AbpTenantManagement::Deleted',
                  record.name
                )
              );
              component!.removeRow(record);
            });
          },
        },
      ],
    },
  ];

  ngOnInit() {
    this.getList();
  }
  getList() {
    this.loading = true;
    this.tenantService
      .getList(this.params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        this.tenants = response.items;
        this.total = response.totalCount;
      });
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
    this.st.load(1);
  }
  search(e) {
    if (e.filter) {
      this.params.filter = e.filter;
    } else {
      delete this.params.filter;
    }
    this.st.load(1);
  }
  resetParameters(): GetTenantsInput {
    return {
      skipCount: 0,
      maxResultCount: 10,
    };
  }
  add() {
    this.modal
      .createStatic(TenantManagementEditComponent, { tenantId: '' })
      .subscribe(() => this.st.reload());
  }
}
