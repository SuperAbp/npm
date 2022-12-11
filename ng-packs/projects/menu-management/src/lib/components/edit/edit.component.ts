import { LocalizationService } from '@abp/ng.core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from '@snow/ng.permission-management';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {
  NzFormatEmitEvent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import { finalize, map, tap } from 'rxjs/operators';
import {
  GetMenuForEditorOutput,
  MenuListDto,
  MenuService,
} from '../../proxy/admin/menus';

@Component({
  selector: 'snow-menu-management-edit',
  templateUrl: './edit.component.html',
  styles: [
    `
      nz-input-number {
        width: 100%;
      }
    `,
  ],
})
export class MenuManagementEditComponent implements OnInit {
  @Input()
  menuId: number;
  menu: GetMenuForEditorOutput;
  menus: NzTreeNodeOptions[] = [];

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private readonly permissionsService: PermissionsService,
    private fb: FormBuilder,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.menuId) {
      this.menuService
        .getEditor(this.menuId)
        .pipe(
          tap((response) => {
            this.menu = response;
            this.buildForm();
            this.loading = false;
          })
        )
        .subscribe();
    } else {
      this.menu = {
        name: '',
        permission: '',
        icon: '',
        route: '',
        sort: 0,
        group: false,
        hideInBreadcrumb: false,
      };
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
    this.permissionsService.get(this.providerName, this.providerKey);

    this.menuService
      .getAllList()
      .pipe(map((res: any) => res.items))
      .pipe(
        map((list: MenuListDto[]) => {
          list
            .filter((l) => l.parentId === null)
            .forEach((menu: MenuListDto) => {
              const children = this.getChildren(list, menu.id);
              this.menus.push({
                title: menu.name,
                key: menu.id.toString(),
                children,
                isLeaf: children.length === 0,
              });
            });
        })
      )
      .subscribe(() => {
        this.form = this.fb.group({
          name: [this.menu.name || '', [Validators.required]],
          permission: [this.menu.permission || ''],
          icon: [this.menu.icon || ''],
          route: [this.menu.route || ''],
          sort: [this.menu.sort || 0],
          group: [this.menu.group || false],
          hideInBreadcrumb: [this.menu.hideInBreadcrumb || false],
          parentId: [
            this.menu.parentId === null || this.menu.parentId === undefined
              ? this.menu.parentId
              : this.menu.parentId.toString() || null,
          ],
        });
      });
  }
  getChildren(list: MenuListDto[], parentId?: number): NzTreeNodeOptions[] {
    const childrenMenu: NzTreeNodeOptions[] = [];
    list
      .filter((l) => l.parentId === parentId)
      .forEach((menu: MenuListDto) => {
        const children = this.getChildren(list, menu.id);
        childrenMenu.push({
          title: menu.name,
          key: menu.id.toString(),
          children,
          isLeaf: children.length === 0,
        });
      });
    return childrenMenu;
  }

  onExpandChange(e: NzFormatEmitEvent): void {
    const node = e.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.menuService
        .getList({
          name: '',
          parentId: Number(node.key),
          skipCount: 0,
          maxResultCount: 100,
          sorting: 'Sort DESC',
        })
        .pipe(map((res: any) => res.items))
        .pipe(
          map((list: any) => {
            const nodes: NzTreeNode[] = [];
            list.map((region: MenuListDto) =>
              nodes.push(
                new NzTreeNode({
                  title: region.name,
                  key: region.id.toString(),
                })
              )
            );
            node.addChildren(nodes);
          })
        )
        .subscribe();
    }
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
    if (this.menuId) {
      this.menuService
        .update(this.menuId, {
          ...this.menu,
          ...this.form.value,
        })
        .pipe(
          tap((response) => {
            this.messageService.success(
              this.localizationService.instant('SnowMenuManagement::Saved')
            );
            this.modal.close(true);
          }),
          finalize(() => (this.isConfirmLoading = false))
        )
        .subscribe();
    } else {
      this.menuService
        .create({
          ...this.form.value,
        })
        .pipe(
          tap((response) => {
            this.messageService.success(
              this.localizationService.instant('SnowMenuManagement::Saved')
            );
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
