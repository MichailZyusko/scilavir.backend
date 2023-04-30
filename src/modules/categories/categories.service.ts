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

    const { data: products } = await this.databaseService.database
      .from('products')
      .select('category_ids, price')
      .throwOnError();

    const mappedCategories = categories.map(({ id, ...category }) => ({
      ...category,
      id,
      minPrice: products.reduce((acc, product) => {
        if (product.category_ids.includes(id)) {
          return acc < product.price ? acc : product.price;
        }

        return acc;
      }, Infinity),
    }));

    return mappedCategories;
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
