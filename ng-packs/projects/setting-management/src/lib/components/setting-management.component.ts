import { ABP, CoreModule } from '@abp/ng.core';
import {
  Component,
  OnDestroy,
  OnInit,
  TrackByFunction,
  inject,
} from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { DelonACLModule } from '@delon/acl';
import { SettingTabsService } from '@super-abp/ng.setting-management/config';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'super-abp-setting-management',
  templateUrl: './setting-management.component.html',
  standalone: true,
  imports: [
    CoreModule,
    NzTabsModule,
    NzCardModule,
    DelonACLModule,
    PageHeaderModule,
  ],
})
export class SettingManagementComponent implements OnDestroy, OnInit {
  private settingTabsService = inject(SettingTabsService);
  private subscription = new Subscription();
  settings: ABP.Tab[] = [];

  selected!: ABP.Tab;

  trackByFn: TrackByFunction<ABP.Tab> = (_, item) => item.name;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription.add(
      this.settingTabsService.visible$.subscribe((settings) => {
        this.settings = settings;
        if (!this.selected) this.selected = this.settings[0];
      })
    );
  }
}
