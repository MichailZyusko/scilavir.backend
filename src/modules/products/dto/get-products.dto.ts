import { SortStrategy } from '../../../enums';

export class GetProductsDto {
  categoryIds?: string[];

  groupIds?: string[];

  sort?: SortStrategy;
}
