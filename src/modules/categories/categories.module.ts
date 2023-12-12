import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
import { DatabaseModule } from '@modules/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
    MulterModule.register(),
    DatabaseModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule { }
