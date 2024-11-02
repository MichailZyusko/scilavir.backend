import {
  Body, Controller, Get, Post,
} from '@nestjs/common';
import { User } from '@decorators/user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@User() userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get('history')
  getOrdersHistory(@User() userId: string) {
    return this.ordersService.getOrdersHistory(userId);
  }
}
