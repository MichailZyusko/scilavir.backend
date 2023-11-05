import { Injectable } from '@nestjs/common';
import {
  FindOptionsSelect, IsNull, Not, Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
import groupBy from 'lodash.groupby';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async find() {
    return this.categoriesRepository.find({
      where: { parentId: Not(IsNull()) },
      select: ['id', 'name', 'parentId'],
    });
  }

  async findRootCategoriesWithSmallestPrice() {
    // TODO add min price to each category via SQL
    const categories = await this.categoriesRepository.find({
      select: ['id', 'name', 'parentId'],
    });
    const nonRootCategories = categories.filter((item) => item.parentId);
    const rootCategories = categories.filter((item) => !item.parentId);

    const products = await this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p')
      .where('p.categoryIds && :categoryIds', {
        categoryIds: nonRootCategories.map(({ id }) => id),
      })
      .getMany();

    const gropedCategories = groupBy(nonRootCategories, 'parentId');

    return rootCategories.map(({ id, ...category }) => {
      const minPriceByCategory = gropedCategories[id]
        .map(({ id: categoryId }) => products.reduce((acc, product) => {
          if (product.categoryIds.includes(categoryId)) {
            return acc < product.price ? acc : product.price;
          }

          return acc;
        }, Infinity));

      return {
        ...category,
        id,
        minPrice: Math.min(...minPriceByCategory),
      };
    });
  }

  async findCategory(id: string) {
    const select = ['id', 'name'] as FindOptionsSelect<Category>;
    const [category, subCategories] = await Promise.all([
      this.categoriesRepository.findOne({
        where: { id },
        select,
      }),
      this.categoriesRepository.find({
        where: { parentId: id },
        select,
      }),
    ]);

    return {
      category: {
        ...category,
        subCategories,
      },
    };
  }

  // TODO: exclude same products as for we are looking for
  async findSimilarProductsByCategoryId(id: string) {
    return this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p')
      .where('p.categoryIds @> :categoryIds', { categoryIds: [id] })
      .orderBy('RANDOM()')
      .limit(2)
      .getMany();
  }
}
