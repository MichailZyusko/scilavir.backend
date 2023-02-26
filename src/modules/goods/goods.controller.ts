import {
  Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Role } from '../users/enums/users.enums';
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
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createGoodDto: CreateGoodDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.goodsService.save(createGoodDto, images);
  }
}
