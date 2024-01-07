import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface DistrictCreateDto extends DistrictCreateOrUpdateDtoBase {
}

export interface DistrictCreateOrUpdateDtoBase {
  code?: string;
  name?: string;
  alias?: string;
  provinceId?: string;
  cityId?: string;
}

export interface DistrictListDto extends EntityDto<string> {
  code?: string;
  name?: string;
  alias?: string;
}

export interface DistrictUpdateDto extends DistrictCreateOrUpdateDtoBase {
}

export interface GetDistrictForEditorOutput extends DistrictCreateOrUpdateDtoBase {
}

export interface GetDistrictsInput extends PagedAndSortedResultRequestDto {
  cityId?: string;
}
