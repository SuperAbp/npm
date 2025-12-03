import {
  CoreModule,
  LocalizationService,
  PermissionService,
} from '@abp/ng.core';
import { Component, Injector, OnInit, ViewChild, inject } from '@angular/core';
import {
  STChange,
  STColumn,
  STComponent,
  STModule,
  STPage,
} from '@delon/abc/st';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';
import { IdentityUserEditComponent } from './edit/edit.component';
import { DelonFormModule, SFSchema } from '@delon/form';
import {
  GetIdentityUsersInput,
  IdentityUserDto,
  IdentityUserService,
} from '@super-abp/ng.identity/proxy';
import { ExtensionsService } from '../../services/extensions.service';
import { eIdentityComponents } from '../../enums';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TreeSelectWidgetModule } from '@delon/form/widgets/tree-select';
import { PageHeaderModule } from '@delon/abc/page-header';

@Component({
    selector: 'super-abp-identity-users',
    templateUrl: './user.component.html',
    standalone: false
})
export class IdentityUserComponent implements OnInit {
  private injector = inject(Injector);
  private modal = inject(ModalHelper);
  private localizationService = inject(LocalizationService);
  private userService = inject(IdentityUserService);
  private permissionService = inject(PermissionService);
  private extensionsService = inject(ExtensionsService);

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
        title: '',
        ui: {
          placeholder: this.localizationService.instant(
            'AbpIdentity::PlaceHolder',
            this.localizationService.instant('AbpIdentity::Filter')
          ),
        },
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[];

  ngOnInit() {
    const propList = this.extensionsService.entityProps
      .get(eIdentityComponents.Users)
      .init(this.injector).props;
    let props = propList.toArray();
    props.push({
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
    });
    this.columns = props;
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
  resetParameters(): GetIdentityUsersInput {
    return {
      skipCount: 0,
      maxResultCount: 10,
    };
  }
  add() {
    this.modal
      .createStatic(IdentityUserEditComponent, { userId: '' })
      .subscribe(() => this.st.reload());
  }
}
