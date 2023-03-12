import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { UserDocument } from '../users/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schema/order.shema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    private readonly mailService: MailService,
  ) { }

  async create(createOrderDto: CreateOrderDto, user: UserDocument) {
    const order = new this.OrderModel({
      ...createOrderDto,
      user,
    });
    await order.save();

    const populatedOrder = await order.populate({
      path: 'goods',
      populate: {
        path: 'goods',
        model: 'Good',
      },
    });

    await this.mailService.sendNewOrderAlert({ order: populatedOrder });

    return order;
  }

  async findAll() {
    const orders = await this.OrderModel.find().populate({
      path: 'goods',
      populate: {
        path: 'goods',
        model: 'Good',
      },
    });

    return orders;
  }
}
