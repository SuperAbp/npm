import { CoreModule, LocalizationService } from '@abp/ng.core';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
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
} from '@super-abp/ng.menu-management/proxy';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
    selector: 'super-abp-menu-management-edit',
    templateUrl: './edit.component.html',
    styles: [
        `
      nz-input-number {
        width: 100%;
      }
    `,
    ],
    imports: [
        CoreModule,
        NzSpinModule,
        NzTreeSelectModule,
        NzFormModule,
        NzButtonModule,
        NzCheckboxModule,
        NzInputModule,
        NzInputNumberLegacyModule,
        NzMessageModule,
    ]
})
export class MenuManagementEditComponent implements OnInit {
  @Input()
  menuId: string;

  private modal = inject(NzModalRef);
  private messageService = inject(NzMessageService);
  private localizationService = inject(LocalizationService);
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);

  menu: GetMenuForEditorOutput;
  menus: NzTreeNodeOptions[] = [];

  loading = false;
  isConfirmLoading = false;

  form: FormGroup = null;

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
      this.menu = {} as GetMenuForEditorOutput;
      this.buildForm();
      this.loading = false;
    }
  }

  buildForm() {
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
          key: [this.menu.key || ''],
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
  getChildren(list: MenuListDto[], parentId?: string): NzTreeNodeOptions[] {
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
          parentId: node.key,
          skipCount: 0,
          maxResultCount: 100,
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
              this.localizationService.instant('SuperAbpMenuManagement::Saved')
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
              this.localizationService.instant('SuperAbpMenuManagement::Saved')
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
