import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from '../database/database.module';
import { Product } from './entity/product.entity';
import { Favorite } from './entity/favorite.entity';

@Module({
  imports: [
    MulterModule.register(),
    TypeOrmModule.forFeature([Product, Favorite]),
    DatabaseModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
