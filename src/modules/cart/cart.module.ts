import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from '../database/database.module';
import { Cart } from './entity/cart.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Cart])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
