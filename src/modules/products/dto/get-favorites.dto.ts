import { SortStrategy } from '@enums/index';
import { PaginationDto } from './pagination-params.dto';

export class GetFavoritesDto extends PaginationDto {
  sort?: SortStrategy;
}
