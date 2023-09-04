import {
  Body, Controller, Delete, Get, Param,
  Post, Query, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SortStrategy } from 'src/enums';
import { User } from '../../decorators/user.decorator';
import { RolesGuard } from '../../guards/role.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../users/enums/users.enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

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
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productsService.save(createProductDto, images);
  }
}
