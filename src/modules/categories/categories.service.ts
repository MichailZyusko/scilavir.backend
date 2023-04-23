import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll() {
    return this.databaseService.database
      .from('categories')
      .select()
      .throwOnError();
  }

  findOne(id: number) {
    return this.databaseService.database
      .from('categories')
      .select()
      .eq('id', id)
      .single()
      .throwOnError();
  }
}
