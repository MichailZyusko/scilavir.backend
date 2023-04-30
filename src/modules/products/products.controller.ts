import {
  Body, Controller, Delete, Get, Param,
  Post, Query, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@supabase/supabase-js';
import { SortStrategy } from 'src/enums';
import { CurrentUser } from '../../decorators/user.decorator';
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
  @UseGuards(SupabaseGuard)
  findFavorites(
    @Query('sort') sort: SortStrategy,
    @CurrentUser() user: User,
  ) {
    return this.productsService.findFavorites(user, sort);
  }

  @Get('/favorites/:productId')
  @UseGuards(SupabaseGuard)
  findFavoritesById(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.findFavoritesById(user, productId);
  }

  @Post('/favorites/:productId')
  @UseGuards(SupabaseGuard)
  addToFavorites(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.addToFavorites(user, productId);
  }

  @Delete('/favorites/:productId')
  @UseGuards(SupabaseGuard)
  deleteFromFavorites(
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.removeFromFavorites(user, productId);
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
