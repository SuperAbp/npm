import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {
  AuditLogDetailDto,
  AuditLogService,
} from '@super-abp/ng.audit-logging/proxy';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'super-abp-audit-logging-view',
  templateUrl: './view.component.html',
})
export class AuditLoggingViewComponent implements OnInit {
  @Input()
  logId: string;
  log: AuditLogDetailDto;
  loading = false;

  constructor(
    private modal: NzModalRef,
    public messageService: NzMessageService,
    public http: _HttpClient,
    private auditLogService: AuditLogService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.auditLogService
      .getDetail(this.logId)
      .pipe(
        tap((result) => {
          this.log = result;
          this.loading = false;
        })
      )
      .subscribe();
  }

  close() {
    this.modal.destroy();
  }
}
