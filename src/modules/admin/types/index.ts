import { Product } from '@modules/products/entity/product.entity';

export type XLSXProduct = {
  groupIds: string;
  categoryIds: string;
} & Omit<Product, 'groupIds' | 'categoryIds'>;
