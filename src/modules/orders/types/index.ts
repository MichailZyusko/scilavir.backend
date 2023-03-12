import { Good } from 'src/modules/goods/schema/goods.schema';

export type TOrder = {
  count: number,
  goods: Good,
};
