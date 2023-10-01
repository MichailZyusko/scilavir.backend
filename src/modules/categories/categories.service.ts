import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Product } from '../products/entity/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async find() {
    // TODO add min price to each category

    const [categories, products] = await Promise.all([
      this.categoriesRepository.find({
        // TODO check if this works
        where: { parentId: null },
        select: ['id', 'name', 'parentId'],
      }),
      this.productsRepository.find({
        select: ['categoryIds', 'price'],
      }),
    ]);

    return categories.map(({ id, ...category }) => ({
      ...category,
      id,
      minPrice: products.reduce((acc, product) => {
        if (product.categoryIds.includes(id)) {
          return acc < product.price ? acc : product.price;
        }

        return acc;
      }, Infinity),
    }));
  }

  async findSubCategories(id: string) {
    return this.categoriesRepository.find({
      where: { parentId: id },
      select: ['id', 'name', 'parentId'],
    });
  }
}
