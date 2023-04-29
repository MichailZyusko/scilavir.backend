import { Injectable } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { DatabaseService } from '../database/database.service';
import { AddNewItemDto } from './dto/add-new-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly databaseService: DatabaseService) { }

  async addNewItem(user: User, payload: AddNewItemDto) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .upsert({
        user_id: user.id,
        product_id: payload.productId,
        quantity: payload.quantity,
      }, { onConflict: 'user_id, product_id' })
      .throwOnError();

    return cart;
  }

  async deleteItem(user: User, productId: string) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .throwOnError();

    return cart;
  }

  async getItemFromCart(user: User, productId: string) {
    const { data: quantity } = await this.databaseService.database
      .from('cart')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    return quantity || { quantity: 0 };
  }

  async getCart(user: User) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .select('quantity, products(id, name, price, images)')
      .eq('user_id', user.id)
      .throwOnError();

    return cart;
  }
}
