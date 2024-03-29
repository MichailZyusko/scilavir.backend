import { Controller, Get, Post } from '@nestjs/common';
import { User } from '@decorators/user.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@User() userId: string) {
    return this.ordersService.create(userId);
  }

  @Get('history')
  getOrdersHistory(@User() userId: string) {
    return this.ordersService.getOrdersHistory(userId);
  }
}
