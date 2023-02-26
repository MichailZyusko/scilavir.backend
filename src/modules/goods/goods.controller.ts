import {
  Body, Controller, Get, Post, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createGoodDto: CreateGoodDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.goodsService.save(createGoodDto, images);
  }
}
