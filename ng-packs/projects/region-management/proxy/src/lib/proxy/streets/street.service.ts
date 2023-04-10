import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetStreetForEditorOutput, GetStreetsInput, StreetCreateDto, StreetListDto, StreetUpdateDto } from '../streets/models';

@Injectable({
  providedIn: 'root',
})
export class StreetService {
  apiName = 'RegionManagement';
  

  create = (input: StreetCreateDto) =>
    this.restService.request<any, StreetListDto>({
      method: 'POST',
      url: '/api/admin/region/streets',
      body: input,
    },
    { apiName: this.apiName });
  

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/admin/region/streets/${id}`,
    },
    { apiName: this.apiName });
  

  getChildren = (districtId: string) =>
    this.restService.request<any, ListResultDto<StreetListDto>>({
      method: 'GET',
      url: `/api/admin/region/streets/${districtId}/children`,
    },
    { apiName: this.apiName });
  

  getEditor = (id: string) =>
    this.restService.request<any, GetStreetForEditorOutput>({
      method: 'GET',
      url: `/api/admin/region/streets/${id}`,
    },
    { apiName: this.apiName });
  

  getList = (input: GetStreetsInput) =>
    this.restService.request<any, PagedResultDto<StreetListDto>>({
      method: 'GET',
      url: '/api/admin/region/streets',
      params: { districtId: input.districtId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });
  

  update = (id: string, input: StreetUpdateDto) =>
    this.restService.request<any, StreetListDto>({
      method: 'PUT',
      url: `/api/admin/region/streets/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
