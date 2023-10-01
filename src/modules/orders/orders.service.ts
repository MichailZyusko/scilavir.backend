import { Injectable } from '@nestjs/common';
import { getUserById } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '@mail/mail.service';
import { Cart } from '@cart/entity/cart.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) { }

  async create(userId: string) {
    const user = await getUserById(userId);

    const cart = await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });

    const { raw: [{ id: orderId }] } = await this.ordersRepository.createQueryBuilder()
      .insert()
      .into('orders')
      .values({ userId })
      .returning(['id'])
      .execute();

    await this.orderItemsRepository.insert(cart.map(({ product, quantity }) => ({
      productId: product.id,
      orderId,
      quantity,
      price: product.price * quantity,
    })));

    await this.mailService.sendNewOrderAlert({
      user,
      cart,
    });

    await this.cartRepository.delete({
      userId,
    });

    return orderId;
  }
}
