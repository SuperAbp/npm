import { RoutesService } from '@abp/ng.core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuService } from '@delon/theme';
import { eSettingManagementRouteNames } from 'projects/setting-management/config/src/lib/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor() {}
}
