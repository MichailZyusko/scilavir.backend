import { TOrderDetails } from '../types';

export class CreateOrderDto {
  cart: { id: string; quantity: number };
  orderDetails: TOrderDetails;
}
