import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entity/group.entity';
import { Product } from '../products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Product])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
