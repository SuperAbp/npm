import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface AuditLogActionDetailDto {
  serviceName?: string;
  methodName?: string;
  parameters?: string;
  executionTime?: string;
  executionDuration: number;
}

export interface AuditLogDetailDto {
  applicationName?: string;
  userName?: string;
  tenantName?: string;
  executionTime?: string;
  executionDuration: number;
  clientIpAddress?: string;
  clientName?: string;
  browserInfo?: string;
  httpMethod?: string;
  url?: string;
  exceptions?: string;
  comments?: string;
  httpStatusCode?: number;
  actions: AuditLogActionDetailDto[];
}

export interface AuditLogListDto extends EntityDto<string> {
  applicationName?: string;
  userName?: string;
  tenantName?: string;
  executionTime?: string;
  executionDuration: number;
  clientIpAddress?: string;
  httpMethod?: string;
  url?: string;
  httpStatusCode?: number;
}

export interface GetAuditLogsInput extends PagedAndSortedResultRequestDto {
  httpMethod?: string;
  url?: string;
  httpStatusCode?: number;
  startDate?: string;
  endDate?: string;
}
