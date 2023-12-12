import { Injectable } from '@nestjs/common';
import {
  FindOptionsSelect, IsNull, Not, Repository,
} from 'typeorm';
import {
  FindOptionsSelect, IsNull, Not, Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
import groupBy from 'lodash.groupby';
import { randomUUID } from 'node:crypto';
import { cropper } from '@utils/index';
import { imagesUrl } from '@constants/index';
import { DatabaseService } from '@modules/database/database.service';
import { DEFAULT_SIMILAR_PRODUCTS_COUNT } from '@constants/defaults';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-group.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly databaseService: DatabaseService,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, images: Express.Multer.File[]) {
    const categoryId = randomUUID();

    await Promise.allSettled(images.map(async (image) => {
      const { data, error } = await this.databaseService.database
        .storage
        .from('backets')
        .upload(`images/categories/${categoryId}/${image.originalname}`, await cropper(image.buffer));

      if (error) {
        console.log(error);
      }

      return data;
    }));

    return this.categoriesRepository
      .insert({
        ...createCategoryDto,
        id: categoryId,
        parentId: createCategoryDto.parentId === 'NULL' ? null : createCategoryDto.parentId,
        image: `${imagesUrl}/categories/${categoryId}/${images.at(0).originalname}`,
      });
  }

  async find() {
    return this.categoriesRepository.find({
      where: { parentId: Not(IsNull()) },
      where: { parentId: Not(IsNull()) },
      select: ['id', 'name', 'parentId'],
    });
  }

  async findRootCategoriesWithSmallestPrice() {
    // TODO add min price to each category via SQL
    const categories = await this.categoriesRepository.find({
      select: ['id', 'name', 'parentId', 'image'],
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
        ?.map(({ id: categoryId }) => products.reduce((acc, product) => {
          if (product.categoryIds.includes(categoryId)) {
            return acc < product.price ? acc : product.price;
          }

          return acc;
        }, Infinity));

      return {
        ...category,
        id,
        minPrice: minPriceByCategory
          ? Math.min(...minPriceByCategory)
          : null,
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

  async findSimilarProductsByCategoryId(id: string, productId: string) {
    return this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p')
      .where('p.categoryIds @> :categoryIds', { categoryIds: [id] })
      .andWhere('p.id != :productId', { productId })
      .orderBy('RANDOM()')
      .limit(DEFAULT_SIMILAR_PRODUCTS_COUNT)
      .getMany();
  }
}
