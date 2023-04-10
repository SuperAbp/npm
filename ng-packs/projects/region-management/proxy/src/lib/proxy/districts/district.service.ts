import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DistrictCreateDto, DistrictListDto, DistrictUpdateDto, GetDistrictForEditorOutput, GetDistrictsInput } from '../districts/models';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  apiName = 'RegionManagement';
  

  create = (input: DistrictCreateDto) =>
    this.restService.request<any, DistrictListDto>({
      method: 'POST',
      url: '/api/admin/region/districts',
      body: input,
    },
    { apiName: this.apiName });
  

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/admin/region/districts/${id}`,
    },
    { apiName: this.apiName });
  

  getChildren = (cityId: string) =>
    this.restService.request<any, ListResultDto<DistrictListDto>>({
      method: 'GET',
      url: `/api/admin/region/districts/${cityId}/children`,
    },
    { apiName: this.apiName });
  

  getEditor = (id: string) =>
    this.restService.request<any, GetDistrictForEditorOutput>({
      method: 'GET',
      url: `/api/admin/region/districts/${id}`,
    },
    { apiName: this.apiName });
  

  getList = (input: GetDistrictsInput) =>
    this.restService.request<any, PagedResultDto<DistrictListDto>>({
      method: 'GET',
      url: '/api/admin/region/districts',
      params: { cityId: input.cityId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });
  

  update = (id: string, input: DistrictUpdateDto) =>
    this.restService.request<any, DistrictListDto>({
      method: 'PUT',
      url: `/api/admin/region/districts/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
