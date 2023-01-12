import type { GetMenuForEditorOutput, GetMenusInput, MenuCreateDto, MenuListDto, MenuTreeNodeDto, MenuUpdateDto } from './models';
import { RestService } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  apiName = 'MenuManagement';

  create = (input: MenuCreateDto) =>
    this.restService.request<any, MenuListDto>({
      method: 'POST',
      url: '/api/menus',
      body: input,
    },
    { apiName: this.apiName });

  delete = (id: number) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/menus/${id}`,
    },
    { apiName: this.apiName });

  getAllList = () =>
    this.restService.request<any, ListResultDto<MenuListDto>>({
      method: 'GET',
      url: '/api/menus/list',
    },
    { apiName: this.apiName });

  getChildren = (id: number) =>
    this.restService.request<any, ListResultDto<MenuTreeNodeDto>>({
      method: 'GET',
      url: `/api/menus/${id}/children`,
    },
    { apiName: this.apiName });

  getEditor = (id: number) =>
    this.restService.request<any, GetMenuForEditorOutput>({
      method: 'GET',
      url: `/api/menus/${id}`,
    },
    { apiName: this.apiName });

  getList = (input: GetMenusInput) =>
    this.restService.request<any, PagedResultDto<MenuListDto>>({
      method: 'GET',
      url: '/api/menus',
      params: { parentId: input.parentId, name: input.name, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName });

  getRoot = () =>
    this.restService.request<any, ListResultDto<MenuTreeNodeDto>>({
      method: 'GET',
      url: '/api/menus/root',
    },
    { apiName: this.apiName });

  update = (id: number, input: MenuUpdateDto) =>
    this.restService.request<any, MenuListDto>({
      method: 'PUT',
      url: `/api/menus/${id}`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}
