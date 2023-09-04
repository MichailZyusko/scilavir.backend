import {
  Body, Controller, Delete, Get, Param, Post,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CartService } from './cart.service';
import { AddNewItemDto } from './dto/add-new-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  addNewItem(
    @Body() payload: AddNewItemDto,
    @User() userId: string,
  ) {
    return this.cartService.addNewItem(userId, payload);
  }

  @Get()
  getCart(@User() userId: string) {
    return this.cartService.getCart(userId);
  }

  @Get('/:productId')
  getProductFromCart(
    @Param('productId') productId: string,
    @User() userId: string,
  ) {
    return this.cartService.getItemFromCart(userId, productId);
  }

  @Delete('/:productId')
  deleteItem(
    @Param('productId') productId: string,
    @User() userId: string,
  ) {
    return this.cartService.deleteItem(userId, productId);
  }
}
