import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

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
  findSimilarProductsByCategoryId(@Param('id') id: string) {
    return this.categoriesService.findSimilarProductsByCategoryId(id);
  }

  @Get(':id/sample')
  findSimilarProductsByCategoryId(@Param('id') id: string) {
    return this.categoriesService.findSimilarProductsByCategoryId(id);
  }
}
