import {
  Body, Controller, Get, Post,
} from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { GoodsService } from './goods.service';

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) { }

  @Get()
  find() {
    return this.goodsService.find();
  }

  @Post()
  create(@Body() createGoodDto: CreateGoodDto) {
    return this.goodsService.save(createGoodDto);
  }
}
