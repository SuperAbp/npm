import { RestService } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import {
  AuditLogDetailDto,
  AuditLogListDto,
  GetAuditLogsInput,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  apiName = 'AuditLogging';

  getDetail = (id: string) =>
    this.restService.request<any, AuditLogDetailDto>(
      {
        method: 'GET',
        url: `/api/audit-logging/${id}`,
      },
      { apiName: this.apiName }
    );

  getList = (input: GetAuditLogsInput) =>
    this.restService.request<any, PagedResultDto<AuditLogListDto>>(
      {
        method: 'GET',
        url: '/api/audit-logging',
        params: {
          httpMethod: input.httpMethod,
          url: input.url,
          httpStatusCode: input.httpStatusCode,
          startDate: input.startDate,
          endDate: input.endDate,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName }
    );

  constructor(private restService: RestService) {}
}
