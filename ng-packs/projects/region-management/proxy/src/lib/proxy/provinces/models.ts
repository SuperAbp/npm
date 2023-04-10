import type { EntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface GetProvinceForEditorOutput extends ProvinceCreateOrUpdateDtoBase {
}

export interface GetProvincesInput extends PagedAndSortedResultRequestDto {
}

export interface ProvinceCreateDto extends ProvinceCreateOrUpdateDtoBase {
}

export interface ProvinceCreateOrUpdateDtoBase {
  code?: string;
  name?: string;
  alias?: string;
}

export interface ProvinceListDto extends EntityDto<string> {
  code?: string;
  name?: string;
  alias?: string;
}

export interface ProvinceUpdateDto extends ProvinceCreateOrUpdateDtoBase {
}
