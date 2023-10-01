import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  find() {
    return this.categoriesService.find();
  }

  @Get(':id')
  findSubCategories(@Param('id') id: string) {
    return this.categoriesService.findSubCategories(id);
  }
}
