import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeModule,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import { finalize, tap } from 'rxjs/operators';
import {
  GetPermissionListResultDto,
  PermissionGrantInfoDto,
  PermissionsService,
  ProviderInfoDto,
} from '@super-abp/ng.permission-management/proxy';
import { CoreModule } from '@abp/ng.core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'super-abp-permission-management',
  templateUrl: './permission-management.component.html',
  // standalone: true,
  // imports: [
  //   CoreModule,
  //   NzButtonModule,
  //   NzTreeModule,
  //   NzCardModule,
  //   NzSpinModule,
  //   NzModalModule,
  // ],
})
export class PermissionManagementComponent implements OnInit {
  @Input()
  readonly providerName: string;

  @Input()
  readonly providerKey: string;

  @Input()
  readonly hideBadges = false;

  protected _visible = false;

  @Input()
  get visible(): boolean {
    return this._visible;
  }
  isConfirmLoading = false;
  unchangedPermissions: PermissionGrantInfoDto[] = [];
  defaultCheckedKeys: string[] = [];
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;
  permissions: NzTreeNodeOptions[];
  /**
   *
   */
  constructor(
    private readonly permissionsService: PermissionsService,
    private modal: NzModalRef
  ) {}
  ngOnInit(): void {
    this.permissionsService
      .get(this.providerName, this.providerKey)
      .pipe(
        tap((response: GetPermissionListResultDto) => {
          const treeArr = [];
          response.groups.forEach((g) => {
            const treeNode: any = {};
            treeNode.title = g.displayName;
            treeNode.key = g.name;
            treeNode.expanded = true;
            treeNode.disabled = true;
            treeNode.children = this.createPermissionsTreeNodel(
              g.permissions,
              null
            );
            treeArr.push(treeNode);
          });
          console.log(treeArr);
          this.permissions = treeArr;
        })
      )
      .subscribe();
  }
  createPermissionsTreeNodel(
    permissions: PermissionGrantInfoDto[],
    parentName
  ): any {
    const nodeArr: any[] = [];
    this.unchangedPermissions = this.unchangedPermissions.concat(permissions);
    let tempPermissions = permissions.filter(
      (p) => p.parentName === parentName
    );
    if (tempPermissions.length == 0) {
      return [];
    }
    tempPermissions.forEach((p) => {
      const treeNode: any = {};
      treeNode.title = p.displayName;
      treeNode.key = p.name;
      treeNode.disabled = this.isGrantedByOtherProviderName(p.grantedProviders);
      let children = this.createPermissionsTreeNodel(permissions, p.name);
      treeNode.isLeaf = children.length == 0;
      treeNode.children = children;
      if (p.isGranted) {
        this.defaultCheckedKeys.push(p.name);
      }
      nodeArr.push(treeNode);
    });
    return nodeArr;
  }

  isGrantedByOtherProviderName(grantedProviders: ProviderInfoDto[]): boolean {
    if (grantedProviders.length) {
      return (
        grantedProviders.findIndex(
          (p) => p.providerName !== this.providerName
        ) > -1
      );
    }
    return false;
  }

  nzCheck(event: NzFormatEmitEvent): void {
    if (event.eventName === 'check') {
      if (
        event.node.isLeaf &&
        event.node.isChecked &&
        !event.node.parentNode.isChecked
      ) {
        event.node.parentNode.setChecked(true);
      }
      if (!event.node.isLeaf && !event.node.isChecked) {
        event.node.children.forEach((n) => {
          n.setChecked(false);
        });
      }
    }
  }

  save() {
    this.isConfirmLoading = true;

    const changedPermissions = this.unchangedPermissions
      .filter((unchanged) => {
        return this.nzTreeComponent.getTreeNodeByKey(unchanged.name)
          .isHalfChecked
          ? this.nzTreeComponent.getTreeNodeByKey(unchanged.name)
              .isHalfChecked === unchanged.isGranted
            ? false
            : true
          : this.nzTreeComponent.getTreeNodeByKey(unchanged.name).isChecked ===
            unchanged.isGranted
          ? false
          : true;
      })
      .map(({ name, isGranted }) => ({ name, isGranted: !isGranted }));

    if (changedPermissions.length > 0) {
      this.permissionsService
        .update(this.providerName, this.providerKey, {
          permissions: changedPermissions,
        })
        .pipe(finalize(() => (this.isConfirmLoading = false)))
        .subscribe(() => {
          this.modal.close(true);
        });
    } else {
      this.isConfirmLoading = false;
      this.modal.close(true);
    }
  }
  getCheckedNodeKey(nodes: NzTreeNode[]): string[] {
    const selectedKeys: string[] = [];

    nodes.forEach((node) => {
      selectedKeys.push(node.key);
      if (node.children.length > 0) {
        selectedKeys.push(...this.getCheckedNodeKey(node.children));
      }
    });
    return selectedKeys;
  }
  close() {
    this.modal.destroy();
  }
}
