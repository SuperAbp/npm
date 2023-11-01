import type {
  GetProvinceForEditorOutput,
  GetProvincesInput,
  ProvinceCreateDto,
  ProvinceListDto,
  ProvinceUpdateDto,
} from './models';
import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProvinceAdminService {
  apiName = 'RegionManagementAdmin';

  create = (input: ProvinceCreateDto) =>
    this.restService.request<any, ProvinceListDto>(
      {
        method: 'POST',
        url: '/api/admin/region/provinces',
        body: input,
      },
      { apiName: this.apiName }
    );

  delete = (id: string) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/admin/region/provinces/${id}`,
      },
      { apiName: this.apiName }
    );

  getAllList = () =>
    this.restService.request<any, ListResultDto<ProvinceListDto>>(
      {
        method: 'GET',
        url: '/api/admin/region/provinces/all',
      },
      { apiName: this.apiName }
    );

  getEditor = (id: string) =>
    this.restService.request<any, GetProvinceForEditorOutput>(
      {
        method: 'GET',
        url: `/api/admin/region/provinces/${id}`,
      },
      { apiName: this.apiName }
    );

  getList = (input: GetProvincesInput) =>
    this.restService.request<any, PagedResultDto<ProvinceListDto>>(
      {
        method: 'GET',
        url: '/api/admin/region/provinces',
        params: {
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName }
    );

  update = (id: string, input: ProvinceUpdateDto) =>
    this.restService.request<any, ProvinceListDto>(
      {
        method: 'PUT',
        url: `/api/admin/region/provinces/${id}`,
        body: input,
      },
      { apiName: this.apiName }
    );

  constructor(private restService: RestService) {}
}
