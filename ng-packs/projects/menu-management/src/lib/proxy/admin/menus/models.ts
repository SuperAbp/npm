import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetMenuForEditorOutput extends EntityDto<number> {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  sort: number;
  parentId?: number;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface GetMenusInput extends PagedAndSortedResultRequestDto {
  parentId?: number;
  name?: string;
}

export interface MenuCreateDto extends MenuCreateOrUpdateDtoBase {
}

export interface MenuCreateOrUpdateDtoBase {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  sort: number;
  parentId?: number;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface MenuListDto extends EntityDto<number> {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  sort: number;
  parentId?: number;
  parentName?: string;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface MenuTreeNodeDto extends EntityDto<number> {
  name?: string;
  isLeaf: boolean;
}

export interface MenuUpdateDto extends MenuCreateOrUpdateDtoBase {
}
