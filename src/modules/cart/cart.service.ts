import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddNewItemDto } from './dto/add-new-item.dto';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) { }

  async addNewItem(userId: string, { productId, quantity }: AddNewItemDto) {
    return this.cartRepository.upsert({
      userId,
      productId,
      quantity,
    }, ['userId', 'productId']);
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
    return this.cartRepository.find({
      where: {
        userId,
      },
      relations: ['product'],
      order: { createdAt: 'ASC' },
      select: ['quantity'],
    });
  }
}
