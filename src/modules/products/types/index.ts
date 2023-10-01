import { GetProductsDto } from '../dto/get-products.dto';

export namespace TProductsService {
  export type FindProducts = {
    userId?: string;
  } & GetProductsDto;
}
