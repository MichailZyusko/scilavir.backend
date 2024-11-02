import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '@mail/mail.module';
import { Product } from '@modules/products/entity/product.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
