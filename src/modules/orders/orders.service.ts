import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly mailService: MailService,
  ) { }

  async create() {
    // const order = new this.OrderModel({
    //   ...createOrderDto,
    //   user,
    // });
    // await order.save();

    // const populatedOrder = await order.populate({
    //   path: 'details',
    //   populate: {
    //     path: 'product',
    //     model: 'Product',
    //   },
    // });

    // await this.mailService.sendNewOrderAlert({ order: populatedOrder });

    // return order;
  }
}
