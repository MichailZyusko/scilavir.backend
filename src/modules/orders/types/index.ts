import { Product } from 'src/modules/products/schema/products.schema';

export type TOrder = {
  count: number,
  product: Product,
};
