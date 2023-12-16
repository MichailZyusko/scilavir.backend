import { SortStrategy } from '@enums/index';
import { PaginationDto } from './pagination-params.dto';

export class GetProductsDto extends PaginationDto {
  categoryIds?: string[];

  groupIds?: string[];

  sort?: SortStrategy;

  search?: string;
}
