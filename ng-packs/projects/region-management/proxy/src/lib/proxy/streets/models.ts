import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetStreetForEditorOutput extends StreetCreateOrUpdateDtoBase {
}

export interface GetStreetsInput extends PagedAndSortedResultRequestDto {
  districtId?: string;
}

export interface StreetCreateDto extends StreetCreateOrUpdateDtoBase {
}

export interface StreetCreateOrUpdateDtoBase {
  code?: string;
  name?: string;
  alias?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
}

export interface StreetListDto extends EntityDto<string> {
  code?: string;
  name?: string;
  alias?: string;
}

export interface StreetUpdateDto extends StreetCreateOrUpdateDtoBase {
}
