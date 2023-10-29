import { SortStrategy } from '@enums/index';

export class GetProductsDto {
  categoryIds?: string[];

  groupIds?: string[];

  sort?: SortStrategy;

  search?: string;
}
