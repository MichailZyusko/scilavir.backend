import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@cart/entity/cart.entity';
import { MailModule } from '@mail/mail.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([Cart, Order, OrderItem]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
