import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CityCreateDto extends CityCreateOrUpdateDtoBase {}

export interface CityCreateOrUpdateDtoBase {
  code?: string;
  name?: string;
  alias?: string;
  provinceId?: string;
  provinceName?: string;
}

export interface CityListDto extends EntityDto<string> {
  code?: string;
  name?: string;
  alias?: string;
}

export interface CityUpdateDto extends CityCreateOrUpdateDtoBase {}

export interface GetCitiesInput extends PagedAndSortedResultRequestDto {
  provinceId?: string;
}

export interface GetCityForEditorOutput extends CityCreateOrUpdateDtoBase {}
