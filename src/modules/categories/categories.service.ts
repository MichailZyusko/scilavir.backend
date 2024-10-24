import { Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@products/entity/product.entity';
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
      select: ['id', 'name', 'parentId'],
    });
  }

  async findRootCategoriesWithSmallestPrice() {
    const categories = await this.categoriesRepository
      .createQueryBuilder('rc')
      .select('rc.id', 'id')
      .addSelect('rc.name', 'name')
      .addSelect('rc.image', 'image')
      .addSelect('rc.description', 'description')
      .addSelect('MIN(p.price)', 'minPrice')
      .innerJoin('categories', 'c', 'c."parentId" = rc.id')
      .innerJoin('products', 'p', 'c.id = ANY(p."categoryIds")')
      .where('rc."parentId" IS NULL')
      .groupBy('rc.id')
      .addGroupBy('rc.name')
      .addGroupBy('rc.image')
      .addGroupBy('rc.description')
      .getRawMany();

    return categories.map((category) => ({
      ...category,
      minPrice: category.minPrice
        ? parseFloat(category.minPrice)
        : null,
    }));
  }

  async findCategoryWithSubCategories(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['subCategories'],
      select: ['id', 'name', 'image', 'subCategories'],
    });

    return { category };
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
