import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entity/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Product])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
