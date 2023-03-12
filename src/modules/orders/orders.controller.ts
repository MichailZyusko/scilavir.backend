import {
  Controller, Get, Post, Body, Req, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserDocument } from '../users/schema/user.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: UserDocument },
  ) {
    const { user } = req;

    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}
