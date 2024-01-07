import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetVillageForEditorOutput extends VillageCreateOrUpdateDtoBase {
}

export interface GetVillagesInput extends PagedAndSortedResultRequestDto {
  streetId?: string;
}

export interface VillageCreateDto extends VillageCreateOrUpdateDtoBase {
}

export interface VillageCreateOrUpdateDtoBase {
  code?: string;
  name?: string;
  alias?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
  streetId?: string;
}

export interface VillageListDto extends EntityDto<string> {
  code?: string;
  name?: string;
  alias?: string;
}

export interface VillageUpdateDto extends VillageCreateOrUpdateDtoBase {
}
