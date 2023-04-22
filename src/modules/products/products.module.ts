import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductsController } from './Products.controller';
import { ProductsService } from './Products.service';
import { DatabaseModule } from '../database/databse.module';

@Module({
  imports: [
    MulterModule.register(),
    DatabaseModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
