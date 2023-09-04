import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AddNewItemDto } from './dto/add-new-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) { }

  async addNewItem(userId: string, payload: AddNewItemDto) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .upsert({
        user_id: userId,
        product_id: payload.productId,
        quantity: payload.quantity,
      }, { onConflict: 'user_id, product_id' })
      .throwOnError();

    return cart;
  }

  async deleteItem(userId: string, productId: string) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .throwOnError();

    return cart;
  }

  async getItemFromCart(userId: string, productId: string) {
    const { data: quantity } = await this.databaseService.database
      .from('cart')
      .select('quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    return quantity || { quantity: 0 };
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
