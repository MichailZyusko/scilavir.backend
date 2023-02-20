import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { Good, GoodSchema } from './schema/goods.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Good.name, schema: GoodSchema }])],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule { }
