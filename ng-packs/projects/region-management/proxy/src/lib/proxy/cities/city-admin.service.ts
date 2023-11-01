import type { CityCreateDto, CityListDto, CityUpdateDto, GetCitiesInput, GetCityForEditorOutput } from './models';
import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CityAdminService {
  apiName = 'RegionManagementAdmin';
  

  create = (input: CityCreateDto) =>
    this.restService.request<any, CityListDto>({
      method: 'POST',
      url: '/api/admin/region/cities',
      body: input,
    },
    { apiName: this.apiName });
  

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/admin/region/cities/${id}`,
    },
    { apiName: this.apiName });
  

  getChildren = (provinceId: string) =>
    this.restService.request<any, ListResultDto<CityListDto>>({
      method: 'GET',
      url: `/api/admin/region/cities/${provinceId}/children`,
    },
    { apiName: this.apiName });
  

  getEditor = (id: string) =>
    this.restService.request<any, GetCityForEditorOutput>({
      method: 'GET',
      url: `/api/admin/region/cities/${id}`,
    },
    { apiName: this.apiName });
  

  getList = (input: GetCitiesInput) =>
    this.restService.request<any, PagedResultDto<CityListDto>>({
      method: 'GET',
      url: '/api/admin/region/cities',
      params: { provinceId: input.provinceId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });
  

  update = (id: string, input: CityUpdateDto) =>
    this.restService.request<any, CityListDto>({
      method: 'PUT',
      url: `/api/admin/region/cities/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
