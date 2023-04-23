import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll() {
    const { data: categories } = await this.databaseService.database
      .from('categories')
      .select('id, name, parent_id')
      .is('parent_id', null)
      .throwOnError();

    return categories;
  }

  async findSubCategories(id: string) {
    const { data: category } = await this.databaseService.database
      .from('categories')
      .select('id, name, parent_id')
      .eq('parent_id', id)
      .throwOnError();

    return category;
  }
}
