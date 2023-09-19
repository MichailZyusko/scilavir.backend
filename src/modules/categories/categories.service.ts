import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) { }

  async find() {
    // TODO add min price to each category
    return this.categoriesRepository.find({
      // TODO check if this works
      where: { parentId: null },
      select: ['id', 'name', 'parentId'],
    });
  }

  async findSubCategories(id: string) {
    return this.categoriesRepository.find({
      where: { parentId: id },
      select: ['id', 'name', 'parentId'],
    });
  }
}
