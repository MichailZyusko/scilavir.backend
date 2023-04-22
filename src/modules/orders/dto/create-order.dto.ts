export class CreateOrderDto {
  products: [{
    productId: string,
    quantity: number
  }];
}
