import {
  Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-group.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // ! TODO: Add roles guard
  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 1))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.categoriesService.create(createCategoryDto, images);
  }

  @Get()
  find() {
    return this.categoriesService.find();
  }

  @Get('roots')
  findRootCategoriesWithSmallestPrice() {
    return this.categoriesService.findRootCategoriesWithSmallestPrice();
  }

  @Get(':id')
  findCategory(@Param('id') id: string) {
    return this.categoriesService.findCategory(id);
  }

  @Get(':id/sample')
  findSimilarProductsByCategoryId(
    @Param('id') id: string,
    @Query('productId') productId: string,
  ) {
    return this.categoriesService.findSimilarProductsByCategoryId(id, productId);
  }
}
