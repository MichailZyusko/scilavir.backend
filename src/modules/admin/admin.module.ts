import { Module } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';
import { Product } from '@modules/products/entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
