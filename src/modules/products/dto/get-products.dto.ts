import { SortStrategy } from 'src/enums';

export class GetProductsDto {
  categoryIds?: string[];

  groupIds?: string[];

  sort?: SortStrategy;
}
