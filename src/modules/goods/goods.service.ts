import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGoodDto } from './dto/create-good.dto';
import { Good, GoodDocument } from './schema/goods.schema';

@Injectable()
export class GoodsService {
  constructor(
    @InjectModel(Good.name) private GoodModel: Model<GoodDocument>,
  ) { }

  find() {
    return this.GoodModel.find();
  }

  save(createGoodDto: CreateGoodDto) {
    const good = new this.GoodModel(createGoodDto);

    return good.save();
  }
}
