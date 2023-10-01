import {
  Body, Controller, Delete, Get, Param,
  Post, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@decorators/user.decorator';
import { SortStrategy } from '@enums/index';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  find(@Query() params: GetProductsDto) {
    return this.productsService.find(params);
  }

  @Get('/favorites')
  findFavorites(
    @Query('sort') sort: SortStrategy,
    @User() userId: string,
  ) {
    return this.productsService.findFavorites(userId, sort);
  }

  // ? Useless since we will addToSelect
  @Get('/favorites/:productId')
  findFavoritesById(
    @Param('productId') productId: string,
    @User() userId: string,
  ) {
    return this.productsService.findFavoritesById(userId, productId);
  }

  @Post('/favorites/:productId')
  addToFavorites(
    @Param('productId') productId: string,
    @User() userId: string,
  ) {
    return this.productsService.addToFavorites(userId, productId);
  }

  @Delete('/favorites/:productId')
  deleteFromFavorites(
    @Param('productId') productId: string,
    @User() userId: string,
  ) {
    return this.productsService.removeFromFavorites(userId, productId);
  }

  @Get('/:id')
  findById(
    @Param('id') id: string,
    @User() userId: string,
  ) {
    return this.productsService.findById(userId, id);
  }

  // ! TODO: Add roles guard
  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productsService.save(createProductDto, images);
  }
}
