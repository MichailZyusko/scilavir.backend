import { Injectable } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) { }

  async create(user: User) {
    const { data: cart } = await this.databaseService.database
      .from('cart')
      .select('quantity, products(id, name, price, images)')
      .eq('user_id', user.id)
      .throwOnError();

    const { data: order } = await this.databaseService.database
      .from('orders')
      .insert([{
        user_id: user.id,
        details: JSON.stringify(cart),
      }])
      .throwOnError();

    await this.mailService.sendNewOrderAlert({
      order: {
        user: {
          firstName: user.user_metadata.firstName,
          lastName: user.user_metadata.lastName,
        },
        details: cart as any,
      },
    });

    await this.databaseService.database
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .throwOnError();

    return order;
  }
}
