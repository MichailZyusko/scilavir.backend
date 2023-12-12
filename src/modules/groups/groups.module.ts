import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '@modules/database/database.module';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Product]),
    MulterModule.register(),
    DatabaseModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
