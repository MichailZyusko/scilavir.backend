import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { CurrentUser } from '../../decorators/user.decorator';
import { OrdersService } from './orders.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(SupabaseGuard)
  create(@CurrentUser() user: User) {
    return this.ordersService.create(user);
  }
}
