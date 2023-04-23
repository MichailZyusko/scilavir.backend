import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll() {
    const { data: categories } = await this.databaseService.database
      .from('categories')
      .select('id, name, parent_id')
      .throwOnError();

    return categories;
  }

  async findOne(id: string) {
    const { data: category } = await this.databaseService.database
      .from('categories')
      .select('id, name, parent_id')
      .eq('id', id)
      .single()
      .throwOnError();

    return category;
  }
}
