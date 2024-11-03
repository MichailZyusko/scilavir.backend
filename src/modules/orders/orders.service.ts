import { Injectable } from '@nestjs/common';
import { getUserById } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MailService } from '@mail/mail.service';
import { Product } from '@modules/products/entity/product.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const user = await getUserById(userId);

    const productsFromCart = await this.productsRepository.find({
      where: { id: In(Object.keys(createOrderDto.cart)) },
      select: ['id', 'price', 'images', 'name'],
    });

    const { raw: [{ id: orderId }] } = await this.ordersRepository.createQueryBuilder()
      .insert()
      .into('orders')
      .values({ userId, orderDetails: createOrderDto.orderDetails })
      .returning(['id'])
      .execute();

    await this.orderItemsRepository.insert(productsFromCart.map(({ id, price }) => {
      const quantity = createOrderDto.cart[id];

      return {
        productId: id,
        orderId,
        quantity,
        price: price * quantity,
      };
    }));

    await this.mailService.sendNewOrderAlert({
      user,
      cart: productsFromCart.map((product) => ({
        ...product,
        quantity: createOrderDto.cart[product.id],
      })),
      orderDetails: createOrderDto.orderDetails,
    });

    // TODO: uncomment this block after implementing the cart feature
    // await this.cartRepository.delete({
    //   userId,
    // });

    return orderId;
  }

  async getOrdersHistory(userId: string) {
    const orders = await this.ordersRepository.find({
      where: { userId },
      select: ['createdAt', 'updatedAt', 'id'],
    });

    const history = await Promise.all(orders.map(async (order) => {
      const items = await this.orderItemsRepository.find({
        where: { orderId: order.id },
        relations: ['product'],
      });

      return {
        ...order,
        items,
      };
    }));

    return history;
  }
}
