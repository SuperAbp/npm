import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { GetVillageForEditorOutput, GetVillagesInput, VillageCreateDto, VillageListDto, VillageUpdateDto } from '../villages/models';

@Injectable({
  providedIn: 'root',
})
export class VillageService {
  apiName = 'RegionManagement';
  

  create = (input: VillageCreateDto) =>
    this.restService.request<any, VillageListDto>({
      method: 'POST',
      url: '/api/admin/region/villages',
      body: input,
    },
    { apiName: this.apiName });
  

  delete = (id: string) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/admin/region/villages/${id}`,
    },
    { apiName: this.apiName });
  

  getChildren = (streetId: string) =>
    this.restService.request<any, ListResultDto<VillageListDto>>({
      method: 'GET',
      url: `/api/admin/region/villages/${streetId}/children`,
    },
    { apiName: this.apiName });
  

  getEditor = (id: string) =>
    this.restService.request<any, GetVillageForEditorOutput>({
      method: 'GET',
      url: `/api/admin/region/villages/${id}`,
    },
    { apiName: this.apiName });
  

  getList = (input: GetVillagesInput) =>
    this.restService.request<any, PagedResultDto<VillageListDto>>({
      method: 'GET',
      url: '/api/admin/region/villages',
      params: { streetId: input.streetId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });
  

  update = (id: string, input: VillageUpdateDto) =>
    this.restService.request<any, VillageListDto>({
      method: 'PUT',
      url: `/api/admin/region/villages/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
