import { LocalizationService, PermissionService } from '@abp/ng.core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STPage } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper } from '@delon/theme';
import {
  CityService,
  DistrictService,
  ProvinceService,
  RegionLevel,
  StreetService,
  VillageService,
} from '@super-abp/ng.region-management/proxy';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import { finalize, pipe, tap } from 'rxjs';
import { RegionCityEditComponent } from '../city/edit/edit.component';
import { RegionDistrictEditComponent } from '../district/edit/edit.component';
import { RegionProvinceEditComponent } from '../province/edit/edit.component';
import { RegionStreetEditComponent } from '../street/edit/edit.component';
import { RegionVillageEditComponent } from '../village/edit/edit.component';

class RegionTempDto {
  id?: string;
  code?: string;
  name?: string;
  alias?: string;
}

@Component({
  selector: 'super-abp-region',
  templateUrl: './region.component.html',
})
export class RegionComponent implements OnInit {
  proinces: NzTreeNodeOptions[] | NzTreeNode[];
  regions: RegionTempDto[];

  regionLevel: RegionLevel = RegionLevel.Province;
  total: number = 0;
  loading = false;
  params = this.resetParameters();
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema;
  @ViewChild('st', { static: false }) st: STComponent;
  basicColumns: STColumn[];
  columns: STColumn[];
  @ViewChild('nzTreeComponent', { static: false })
  nzTreeComponent!: NzTreeComponent;

  constructor(
    private modal: ModalHelper,
    private messageService: NzMessageService,
    private localizationService: LocalizationService,
    private permissionService: PermissionService,
    private provinceService: ProvinceService,
    private cityService: CityService,
    private districtService: DistrictService,
    private streetService: StreetService,
    private villageService: VillageService
  ) {
    this.basicColumns = [
      {
        title: this.localizationService.instant(
          'SuperAbpRegionManagement::Name'
        ),
        index: 'name',
      },
      {
        title: this.localizationService.instant(
          'SuperAbpRegionManagement::Code'
        ),
        index: 'code',
      },
    ];
    this.columns = this.getColumns();
  }

  ngOnInit(): void {
    this.loadProvince();
    this.getList();
  }

  getList() {
    this.loading = true;
    this.columns = this.getColumns();
    console.log(this.columns);

    var callback = () => (this.loading = false);
    switch (this.regionLevel) {
      case RegionLevel.City:
        {
          this.cityService
            .getList(this.params)
            .pipe(finalize(callback))
            .subscribe(
              (response) => (
                (this.regions = response.items),
                (this.total = response.totalCount)
              )
            );
        }
        break;
      case RegionLevel.District:
        {
          this.districtService
            .getList(this.params)
            .pipe(finalize(callback))
            .subscribe(
              (response) => (
                (this.regions = response.items),
                (this.total = response.totalCount)
              )
            );
        }
        break;
      case RegionLevel.Street:
        {
          this.streetService
            .getList(this.params)
            .pipe(finalize(callback))
            .subscribe(
              (response) => (
                (this.regions = response.items),
                (this.total = response.totalCount)
              )
            );
        }
        break;
      case RegionLevel.Village:
        {
          this.villageService
            .getList(this.params)
            .pipe(finalize(callback))
            .subscribe(
              (response) => (
                (this.regions = response.items),
                (this.total = response.totalCount)
              )
            );
        }
        break;
      default:
        {
          this.provinceService
            .getList(this.params)
            .pipe(finalize(callback))
            .subscribe(
              (response) => (
                (this.regions = response.items),
                (this.total = response.totalCount)
              )
            );
        }
        break;
    }
  }
  loadProvince() {
    this.provinceService
      .getAllList()
      .pipe(
        tap((res) => {
          this.proinces = res.items.map((p) => {
            return { title: p.name, key: p.id };
          });
        })
      )
      .subscribe();
  }

  resetParameters() {
    return {
      skipCount: 0,
      maxResultCount: 10,
    };
  }

  add() {
    let selectNode: NzTreeNode;
    if (
      this.nzTreeComponent &&
      this.nzTreeComponent.getSelectedNodeList().length === 1
    ) {
      selectNode = this.nzTreeComponent.getSelectedNodeList()[0];
    }
    switch (this.regionLevel) {
      case RegionLevel.City:
        {
          if (
            !this.permissionService.getGrantedPolicy(
              'SuperAbpRegionManagement.City.Create'
            )
          ) {
            this.messageService.error(
              this.localizationService.instant(
                'SuperAbpRegionManagement::403MessageDetail'
              )
            );
            return;
          }
          this.modal
            .createStatic(RegionCityEditComponent, {
              id: '',
              provinceId: selectNode.key,
            })
            .subscribe(() => this.st.reload());
        }
        break;
      case RegionLevel.District:
        {
          if (
            !this.permissionService.getGrantedPolicy(
              'SuperAbpRegionManagement.District.Create'
            )
          ) {
            this.messageService.error(
              this.localizationService.instant(
                'SuperAbpRegionManagement::403MessageDetail'
              )
            );
            return;
          }
          this.modal
            .createStatic(RegionDistrictEditComponent, {
              id: '',
              provinceId: selectNode.parentNode.key,
              cityId: selectNode.key,
            })
            .subscribe(() => this.st.reload());
        }
        break;
      case RegionLevel.Street:
        {
          if (
            !this.permissionService.getGrantedPolicy(
              'SuperAbpRegionManagement.Street.Create'
            )
          ) {
            this.messageService.error(
              this.localizationService.instant(
                'SuperAbpRegionManagement::403MessageDetail'
              )
            );
            return;
          }
          this.modal
            .createStatic(RegionStreetEditComponent, {
              id: '',
              provinceId: selectNode.parentNode.parentNode.key,
              cityId: selectNode.parentNode.key,
              districtId: selectNode.key,
            })
            .subscribe(() => this.st.reload());
        }
        break;
      case RegionLevel.Village:
        {
          if (
            !this.permissionService.getGrantedPolicy(
              'SuperAbpRegionManagement.Village.Create'
            )
          ) {
            this.messageService.error(
              this.localizationService.instant(
                'SuperAbpRegionManagement::403MessageDetail'
              )
            );
            return;
          }
          this.modal
            .createStatic(RegionVillageEditComponent, {
              id: '',
              provinceId: selectNode.parentNode.parentNode.parentNode.key,
              cityId: selectNode.parentNode.parentNode.key,
              districtId: selectNode.parentNode.key,
              streetId: selectNode.key,
            })
            .subscribe(() => this.st.reload());
        }
        break;
      default:
        {
          if (
            !this.permissionService.getGrantedPolicy(
              'SuperAbpRegionManagement.Province.Create'
            )
          ) {
            this.messageService.error(
              this.localizationService.instant(
                'SuperAbpRegionManagement::403MessageDetail'
              )
            );
            return;
          }
          this.modal
            .createStatic(RegionProvinceEditComponent, {
              id: '',
            })
            .subscribe(() => {
              this.st.reload();
              this.loadProvince();
            });
        }
        break;
    }
  }

  change(e: STChange) {
    if (e.type === 'pi' || e.type === 'ps') {
      this.params.skipCount = (e.pi - 1) * e.ps;
      this.params.maxResultCount = e.ps;
      this.getList();
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    const key = event.keys[event.keys.length - 1];
    this.setLevel(event.node.level);
    const node = event.node;
    if (event.eventName === 'expand') {
      if (node.children.length > 0) {
        return;
      }
      switch (this.regionLevel) {
        case RegionLevel.City:
          {
            this.cityService
              .getChildren(key)
              .pipe(
                tap((res) => {
                  const nodes = res.items.map((p) => {
                    return { title: p.name, key: p.id };
                  });
                  node.addChildren(nodes);
                })
              )
              .subscribe();
          }
          break;
        case RegionLevel.District:
          {
            this.districtService
              .getChildren(key)
              .pipe(
                tap((res) => {
                  const nodes = res.items.map((p) => {
                    return { title: p.name, key: p.id };
                  });
                  node.addChildren(nodes);
                })
              )
              .subscribe();
          }
          break;
        case RegionLevel.Street:
          {
            this.streetService
              .getChildren(key)
              .pipe(
                tap((res) => {
                  const nodes = res.items.map((p) => {
                    return { title: p.name, key: p.id };
                  });
                  node.addChildren(nodes);
                })
              )
              .subscribe();
          }
          break;
        case RegionLevel.Village:
          {
            this.villageService
              .getChildren(key)
              .pipe(
                tap((res) => {
                  const nodes = res.items.map((p) => {
                    return {
                      title: p.name,
                      key: p.id,
                      isLeaf: true,
                      isSelectable: false,
                    };
                  });

                  node.addChildren(nodes);
                })
              )
              .subscribe();
          }
          break;
      }
    } else {
      if (node.isLeaf) {
        return;
      }
      if (event.keys.length === 0) {
        this.setLevel(-1);
        this.getList();
        return;
      }
      this.params[this.getKey()] = key;
      this.getList();
    }
  }
  setLevel(level) {
    let tempLevel = RegionLevel.Province;
    if (level === 0) {
      tempLevel = RegionLevel.City;
    } else if (level === 1) {
      tempLevel = RegionLevel.District;
    } else if (level === 2) {
      tempLevel = RegionLevel.Street;
    } else if (level === 3) {
      tempLevel = RegionLevel.Village;
    }
    this.regionLevel = tempLevel;
  }
  getKey() {
    switch (this.regionLevel) {
      case RegionLevel.City:
        return 'provinceId';
      case RegionLevel.District:
        return 'cityId';
      case RegionLevel.Street:
        return 'districtId';
      case RegionLevel.Village:
        return 'streetId';
      default:
        return '';
    }
  }
  getColumns() {
    // TODO:同步删除树节点
    let tempColumns = [...this.basicColumns];
    let selectNode: NzTreeNode;
    if (
      this.nzTreeComponent &&
      this.nzTreeComponent.getSelectedNodeList().length === 1
    ) {
      selectNode = this.nzTreeComponent.getSelectedNodeList()[0];
    }
    switch (this.regionLevel) {
      case RegionLevel.City:
        tempColumns.push({
          title: this.localizationService.instant(
            'SuperAbpRegionManagement::Actions'
          ),
          buttons: [
            {
              icon: 'edit',
              type: 'modal',
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.City.Update'
                );
              },
              modal: {
                component: RegionCityEditComponent,
                params: (record: any) => ({
                  id: record.id,
                  provinceId: selectNode.key,
                }),
              },
              click: 'reload',
            },
            {
              icon: 'delete',
              type: 'del',
              pop: {
                title: this.localizationService.instant(
                  'SuperAbpRegionManagement::AreYouSure'
                ),
                okType: 'danger',
                icon: 'star',
              },
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.City.Delete'
                );
              },
              click: (record, _modal, component) => {
                this.cityService.delete(record.id).subscribe((response) => {
                  component!.removeRow(record);
                });
              },
            },
          ],
        });
        break;
      case RegionLevel.District:
        tempColumns.push({
          title: this.localizationService.instant(
            'SuperAbpRegionManagement::Actions'
          ),
          buttons: [
            {
              icon: 'edit',
              type: 'modal',
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.District.Update'
                );
              },
              modal: {
                component: RegionDistrictEditComponent,
                params: (record: any) => ({
                  id: record.id,
                  provinceId: selectNode.parentNode.key,
                  cityId: selectNode.key,
                }),
              },
              click: 'reload',
            },
            {
              icon: 'delete',
              type: 'del',
              pop: {
                title: this.localizationService.instant(
                  'SuperAbpRegionManagement::AreYouSure'
                ),
                okType: 'danger',
                icon: 'star',
              },
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.District.Delete'
                );
              },
              click: (record, _modal, component) => {
                this.districtService.delete(record.id).subscribe((response) => {
                  component!.removeRow(record);
                });
              },
            },
          ],
        });
        break;
      case RegionLevel.Street:
        tempColumns.push({
          title: this.localizationService.instant(
            'SuperAbpRegionManagement::Actions'
          ),
          buttons: [
            {
              icon: 'edit',
              type: 'modal',
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Street.Update'
                );
              },
              modal: {
                component: RegionStreetEditComponent,
                params: (record: any) => ({
                  id: record.id,
                  provinceId: selectNode.parentNode.parentNode.key,
                  cityId: selectNode.parentNode.key,
                  districtId: selectNode.key,
                }),
              },
              click: 'reload',
            },
            {
              icon: 'delete',
              type: 'del',
              pop: {
                title: this.localizationService.instant(
                  'SuperAbpRegionManagement::AreYouSure'
                ),
                okType: 'danger',
                icon: 'star',
              },
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Street.Delete'
                );
              },
              click: (record, _modal, component) => {
                this.streetService.delete(record.id).subscribe((response) => {
                  component!.removeRow(record);
                });
              },
            },
          ],
        });
        break;
      case RegionLevel.Village:
        tempColumns.push({
          title: this.localizationService.instant(
            'SuperAbpRegionManagement::Actions'
          ),
          buttons: [
            {
              icon: 'edit',
              type: 'modal',
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Village.Update'
                );
              },
              modal: {
                component: RegionVillageEditComponent,
                params: (record: any) => ({
                  id: record.id,
                  provinceId: selectNode.parentNode.parentNode.parentNode.key,
                  cityId: selectNode.parentNode.parentNode.key,
                  districtId: selectNode.parentNode.key,
                  streetId: selectNode.key,
                }),
              },
              click: 'reload',
            },
            {
              icon: 'delete',
              type: 'del',
              pop: {
                title: this.localizationService.instant(
                  'SuperAbpRegionManagement::AreYouSure'
                ),
                okType: 'danger',
                icon: 'star',
              },
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Village.Delete'
                );
              },
              click: (record, _modal, component) => {
                this.villageService.delete(record.id).subscribe((response) => {
                  component!.removeRow(record);
                });
              },
            },
          ],
        });
        break;
      default:
        tempColumns.push({
          title: this.localizationService.instant(
            'SuperAbpRegionManagement::Actions'
          ),
          buttons: [
            {
              icon: 'edit',
              type: 'modal',
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Province.Update'
                );
              },
              modal: {
                component: RegionProvinceEditComponent,
                params: (record: any) => ({
                  id: record.id,
                }),
              },
              click: 'reload',
            },
            {
              icon: 'delete',
              type: 'del',
              pop: {
                title: this.localizationService.instant(
                  'SuperAbpRegionManagement::AreYouSure'
                ),
                okType: 'danger',
                icon: 'star',
              },
              iif: () => {
                return this.permissionService.getGrantedPolicy(
                  'SuperAbpRegionManagement.Province.Delete'
                );
              },
              click: (record, _modal, component) => {
                this.provinceService.delete(record.id).subscribe((response) => {
                  component!.removeRow(record);
                });
              },
            },
          ],
        });
        break;
    }
    return tempColumns;
  }
}
