import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetMenuForEditorOutput extends EntityDto<string> {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  key?: string;
  sort: number;
  parentId?: string;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface GetMenusInput extends PagedAndSortedResultRequestDto {
  parentId?: string;
  name?: string;
}

export interface MenuCreateDto extends MenuCreateOrUpdateDtoBase {
}

export interface MenuCreateOrUpdateDtoBase {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  key?: string;
  sort: number;
  parentId?: string;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface MenuListDto extends EntityDto<string> {
  name?: string;
  permission?: string;
  icon?: string;
  route?: string;
  sort: number;
  parentId?: string;
  parentName?: string;
  group: boolean;
  hideInBreadcrumb: boolean;
}

export interface MenuTreeNodeDto extends EntityDto<string> {
  name?: string;
  isLeaf: boolean;
}

export interface MenuUpdateDto extends MenuCreateOrUpdateDtoBase {
}
