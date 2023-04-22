import {
  Controller, Post, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@supabase/supabase-js';
import { OrdersService } from './orders.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(SupabaseGuard)
  create(
    @CurrentUser() user: User,
  ) {
    return this.ordersService.create();
  }
}
