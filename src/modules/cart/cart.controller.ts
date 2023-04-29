import {
  Body, Controller, Delete, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@supabase/supabase-js';
import { CartService } from './cart.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';
import { AddNewItemDto } from './dto/add-new-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  @UseGuards(SupabaseGuard)
  addNewItem(
    @Body() payload: AddNewItemDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.addNewItem(user, payload);
  }

  @Get()
  @UseGuards(SupabaseGuard)
  getCart(@CurrentUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Get('/:productId')
  @UseGuards(SupabaseGuard)
  getProductFromCart(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.cartService.getItemFromCart(user, productId);
  }

  @Delete('/:productId')
  @UseGuards(SupabaseGuard)
  deleteItem(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.cartService.deleteItem(user, productId);
  }
}
