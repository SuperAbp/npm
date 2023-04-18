import {
  ListResultDto,
  LocalizationService,
  PermissionService,
} from '@abp/ng.core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc/st';
import {
  SFSchema,
  SFSchemaEnumType,
  SFTreeSelectWidgetSchema,
} from '@delon/form';
import { ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize, map } from 'rxjs/operators';
import { MenuManagementEditComponent } from './edit/edit.component';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import {
  GetMenusInput,
  MenuListDto,
  MenuService,
  MenuTreeNodeDto,
} from '@super-abp/ng.menu-management/proxy';

@Component({
  selector: 'super-abp-menu-management',
  templateUrl: './menu-management.component.html',
})
export class MenuManagementComponent implements OnInit {
  menus: MenuListDto[];
  parents: NzTreeNodeOptions[] = [];
  selectMenus: SFSchemaEnumType[] = [];
  total: number;
  loading = false;
  params: GetMenusInput = this.resetParameters();
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema;
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[];

  constructor(
    private modal: ModalHelper,
    private localizationService: LocalizationService,
    private messageService: NzMessageService,
    private permissionService: PermissionService,
    private menuService: MenuService
  ) {
    this.searchSchema = {
      properties: {
        name: {
          type: 'string',
          title: '',
          ui: {
            placeholder: this.localizationService.instant(
              'SuperAbpMenuManagement::Placeholder',
              this.localizationService.instant('SuperAbpMenuManagement::Name')
            ),
          },
        },
        parentId: {
          type: 'string',
          title: '',
          ui: {
            widget: 'tree-select',
            placeholder: this.localizationService.instant(
              'SuperAbpMenuManagement::ChoosePlaceholder',
              this.localizationService.instant('SuperAbpMenuManagement::Parent')
            ),
            dropdownMatchSelectWidth: false,
            dropdownStyle: { 'max-height': '300px' },
            asyncData: () =>
              this.menuService
                .getRoot()
                .pipe(map((res: ListResultDto<MenuTreeNodeDto>) => res.items))
                .pipe(
                  map((list: any) => {
                    return list.map((menu: MenuTreeNodeDto) => ({
                      title: menu.name,
                      key: menu.id.toString(),
                      isLeaf: menu.isLeaf,
                    }));
                  })
                ),
            expandChange: (e: NzFormatEmitEvent) =>
              this.menuService
                .getChildren(Number(e.node.key))
                .pipe(map((res: any) => res.items))
                .pipe(
                  map((list: any) => {
                    return list.map((menu: MenuTreeNodeDto) => ({
                      title: menu.name,
                      key: menu.id.toString(),
                      isLeaf: menu.isLeaf,
                    }));
                  })
                ),
          } as SFTreeSelectWidgetSchema,
        },
      },
    };
    this.columns = [
      {
        title: this.localizationService.instant('SuperAbpMenuManagement::Name'),
        index: 'name',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::Route'
        ),
        index: 'route',
      },
      {
        title: this.localizationService.instant('SuperAbpMenuManagement::Sort'),
        index: 'sort',
        sort: true,
      },
      {
        title: this.localizationService.instant('SuperAbpMenuManagement::Icon'),
        index: 'icon',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::Permission'
        ),
        index: 'permission',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::Group'
        ),
        index: 'group',
        type: 'yn',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::HideInBreadcrumb'
        ),
        index: 'hideInBreadcrumb',
        type: 'yn',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::ParentName'
        ),
        index: 'parentName',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpMenuManagement::Actions'
        ),
        buttons: [
          {
            icon: 'edit',
            type: 'modal',
            tooltip: this.localizationService.instant(
              'SuperAbpMenuManagement::Edit'
            ),
            iif: () => {
              return this.permissionService.getGrantedPolicy(
                'SuperAbpMenuManagement.Menu.Update'
              );
            },
            modal: {
              component: MenuManagementEditComponent,
              params: (record: any) => ({
                menuId: record.id,
              }),
            },
            click: 'reload',
          },
          {
            icon: 'delete',
            type: 'del',
            tooltip: this.localizationService.instant(
              'SuperAbpMenuManagement::Delete'
            ),
            pop: {
              title: this.localizationService.instant(
                'SuperAbpMenuManagement::AreYouSure'
              ),
              okType: 'danger',
              icon: 'star',
            },
            iif: () => {
              return this.permissionService.getGrantedPolicy(
                'SuperAbpMenuManagement.Menu.Delete'
              );
            },
            click: (record, _modal, component) => {
              this.menuService.delete(record.id).subscribe((response) => {
                this.messageService.success(
                  this.localizationService.instant(
                    'SuperAbpMenuManagement::Deleted',
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
  }

  ngOnInit() {
    this.menuService
      .getRoot()
      .pipe(map((res: ListResultDto<MenuTreeNodeDto>) => res.items))
      .pipe(
        map((list: MenuTreeNodeDto[]) => {
          this.parents = list.map(
            (menu: MenuTreeNodeDto) =>
              ({
                title: menu.name,
                key: menu.id.toString(),
                isLeaf: menu.isLeaf,
              } as NzTreeNodeOptions)
          );
        })
      )
      .subscribe();
    this.getList();
  }
  getList() {
    this.loading = true;
    this.menuService
      .getList(this.params)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (response) => (
          (this.menus = response.items), (this.total = response.totalCount)
        )
      );
  }
  resetParameters(): GetMenusInput {
    return {
      name: '',
      skipCount: 0,
      maxResultCount: 10,
      sorting: 'Sort Desc',
    } as GetMenusInput;
  }
  onExpandChange(e: NzFormatEmitEvent): void {
    const node = e.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.menuService
        .getChildren(Number(e.node.key))
        .pipe(map((res: ListResultDto<MenuTreeNodeDto>) => res.items))
        .pipe(
          map((list: MenuTreeNodeDto[]) => {
            node.addChildren(
              list.map((menu: MenuTreeNodeDto) => ({
                title: menu.name,
                key: menu.id.toString(),
                isLeaf: menu.isLeaf,
              }))
            );
          })
        )
        .subscribe();
    }
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
    if (e.name) {
      this.params.name = e.name;
    } else {
      delete this.params.name;
    }
    if (e.parentId) {
      this.params.parentId = e.parentId;
    } else {
      delete this.params.parentId;
    }
    this.getList();
  }
  add() {
    this.modal
      .createStatic(MenuManagementEditComponent, { menuId: '' })
      .subscribe(() => this.st.reload());
  }
}
