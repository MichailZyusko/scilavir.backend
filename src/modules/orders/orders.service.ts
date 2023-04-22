import { Injectable } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) { }

  async create(user: User, createOrderDto: CreateOrderDto) {
    const { data: order } = await this.databaseService.database
      .from('orders')
      .insert([{
        user_id: user.id,
        details: JSON.stringify(createOrderDto.products),
      }])
      .throwOnError();

    const { data: products } = await this.databaseService.database
      .from('products')
      .select('*')
      .in('id', createOrderDto.products.map((product) => product.productId))
      .throwOnError();
    const mappedProducts = products.map((product, idx) => ({
      name: product.name,
      count: createOrderDto.products[idx].quantity,
    }));

    await this.mailService.sendNewOrderAlert({
      order: {
        user: {
          firstName: user.user_metadata.firstName,
          lastName: user.user_metadata.lastName,
        },
        details: mappedProducts,
      },
    });

    return order;
  }
}
