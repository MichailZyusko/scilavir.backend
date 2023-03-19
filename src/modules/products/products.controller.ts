import {
  Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../guards/role.guard';
import { Roles } from '../../decorators/role.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Role } from '../users/enums/users.enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './Products.service';

@Controller('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  find() {
    return this.productsService.find();
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productsService.save(createProductDto, images);
  }
}
