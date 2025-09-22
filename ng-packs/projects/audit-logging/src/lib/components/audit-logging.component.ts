import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  STPage,
  STComponent,
  STColumn,
  STChange,
  STModule,
} from '@delon/abc/st';
import {
  SFSchema,
  SFDateWidgetSchema,
  SFSelectWidgetSchema,
  DelonFormModule,
} from '@delon/form';
import { tap } from 'rxjs/operators';
import { DelonLocaleService } from '@delon/theme';
import { CoreModule, LocalizationService } from '@abp/ng.core';
import { formatDate } from '@angular/common';
import { addDays } from 'date-fns';
import { AuditLoggingViewComponent } from './view/view.component';
import { dateTimePickerUtil } from '@delon/util';
import {
  AuditLogListDto,
  AuditLogService,
  GetAuditLogsInput,
} from '@super-abp/ng.audit-logging/proxy';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PageHeaderModule } from '@delon/abc/page-header';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'super-abp-audit-logging',
  templateUrl: './audit-logging.component.html',
  styles: [],
  standalone: true,
  imports: [
    CoreModule,
    NzButtonModule,
    NzCardModule,
    STModule,
    PageHeaderModule,
    DelonFormModule,
    NzBadgeModule,
  ],
})
export class AuditLoggingComponent implements OnInit {
  private delonLocaleService = inject(DelonLocaleService);
  private auditLogService = inject(AuditLogService);
  private localizationService = inject(LocalizationService);

  logs: AuditLogListDto[];
  total: number;
  today = new Date();

  loading = false;
  params: GetAuditLogsInput = this.resetParameters();
  page: STPage = {
    show: true,
    showSize: true,
    front: false,
    pageSizes: [10, 20, 30, 40, 50],
  };
  searchSchema: SFSchema = {
    properties: {
      httpMethod: {
        type: 'string',
        title: '',
        enum: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
        ui: {
          widget: 'select',
          allowClear: true,
          placeholder: this.localizationService.instant(
            'SuperAbpAuditLogging::ChoosePlaceholder',
            this.localizationService.instant('SuperAbpAuditLogging::HttpMethod')
          ),
        } as SFSelectWidgetSchema,
      },
      url: {
        type: 'string',
        title: '',
        ui: {
          width: 200,
          placeholder: this.localizationService.instant(
            'SuperAbpAuditLogging::Placeholder',
            this.localizationService.instant('SuperAbpAuditLogging::Url')
          ),
        },
      },
      httpStatusCode: {
        type: 'integer',
        title: '',
        ui: {
          widgetWidth: 150,
          placeholder: this.localizationService.instant(
            'SuperAbpAuditLogging::Placeholder',
            this.localizationService.instant(
              'SuperAbpAuditLogging::HttpStatusCode'
            )
          ),
        },
      },
      startDate: {
        type: 'string',
        title: '',
        ui: {
          widget: 'date',
          end: 'endDate',
          allowClear: false,
          disabledDate: (current: Date): boolean => {
            return dateTimePickerUtil.getDiffDays(current, this.today) > 0;
          },
        } as SFDateWidgetSchema,
        default: this.params.startDate,
      },
      endDate: {
        type: 'string',
        default: this.params.endDate,
      },
    },
  };
  @ViewChild('st', { static: true }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::ApplicationName'
      ),
      index: 'applicationName',
    },
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::ClientIpAddress'
      ),
      index: 'clientIpAddress',
    },
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::HttpMethod'
      ),
      index: 'httpMethod',
    },
    {
      title: this.localizationService.instant('SuperAbpAuditLogging::Url'),
      width: '50px',
      index: 'url',
    },
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::ExecutionTime'
      ),
      type: 'date',
      index: 'executionTime',
      sort: true,
    },
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::ExecutionDuration'
      ),
      index: 'executionDuration',
      sort: true,
    },
    {
      title: this.localizationService.instant(
        'SuperAbpAuditLogging::HttpStatusCode'
      ),
      render: 'customerHttpStatusCode',
    },
    {
      title: this.localizationService.instant('SuperAbpAuditLogging::Actions'),
      buttons: [
        {
          text: this.localizationService.instant('SuperAbpAuditLogging::View'),
          type: 'modal',
          modal: {
            component: AuditLoggingViewComponent,
            size: 'xl',
            params: (record: AuditLogListDto) => ({
              logId: record.id,
            }),
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
    this.auditLogService
      .getList(this.params)
      .pipe(tap(() => (this.loading = false)))
      .subscribe(
        (response) => (
          (this.logs = response.items), (this.total = response.totalCount)
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

  reset() {
    this.params = this.resetParameters();
    this.st.load(1);
  }
  search(e) {
    if (e.httpMethod) {
      this.params.httpMethod = e.httpMethod;
    } else {
      delete this.params.httpMethod;
    }
    if (e.url) {
      this.params.url = e.url;
    } else {
      delete this.params.url;
    }
    if (e.httpStatusCode) {
      this.params.httpStatusCode = e.httpStatusCode;
    } else {
      delete this.params.httpStatusCode;
    }
    if (e.startDate) {
      this.params.startDate = e.startDate;
    } else {
      delete this.params.startDate;
    }
    if (e.endDate) {
      this.params.endDate = e.endDate;
    } else {
      delete this.params.endDate;
    }
    this.st.load(1);
  }

  resetParameters(): GetAuditLogsInput {
    return {
      httpMethod: '',
      url: '',
      httpStatusCode: null,
      startDate: formatDate(
        addDays(this.today, -1),
        'yyyy-MM-dd',
        this.delonLocaleService.locale.abbr
      ),
      endDate: formatDate(
        this.today,
        'yyyy-MM-dd',
        this.delonLocaleService.locale.abbr
      ),
      skipCount: 0,
      maxResultCount: 10,
    };
  }
}
