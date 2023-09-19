import {
  Body, Controller, Delete, Get, Param,
  Post, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SortStrategy } from 'src/enums';
import { User } from '../../decorators/user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  find() {
    return this.productsService.find();
  }

  @Get('/favorites')
  findFavorites(
    @Query('sort') sort: SortStrategy,
    @User() userId: string,
  ) {
    return this.productsService.findFavorites(userId, sort);
  }

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

  @Get('/categories/:categoryId')
  findProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('sort') sort: SortStrategy,
  ) {
    return this.productsService.findByCategory(categoryId, sort);
  }

  @Get('/groups/:groupId')
  findProductsByGroup(
    @Param('groupId') groupId: string,
    @Query('sort') sort: SortStrategy,
  ) {
    return this.productsService.findByGroup(groupId, sort);
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
