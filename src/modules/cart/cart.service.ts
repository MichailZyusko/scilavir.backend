import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../database/database.service';
import { AddNewItemDto } from './dto/add-new-item.dto';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) { }

  async addNewItem(userId: string, payload: AddNewItemDto) {
    return this.cartRepository.insert({
      userId,
      productId: payload.productId,
      quantity: payload.quantity,
    });
  }

  async deleteItem(userId: string, productId: string) {
    return this.cartRepository.delete({
      userId,
      productId,
    });
  }

  async getItemFromCart(userId: string, productId: string) {
    return this.cartRepository.findOne({
      where: {
        userId,
        productId,
      },
      select: ['quantity'],
    });
  }

  async getCart(userId: string) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .select('quantity, products(id, name, price, images)')
      .eq('user_id', userId)
      .throwOnError();

    return cart;
  }
}
