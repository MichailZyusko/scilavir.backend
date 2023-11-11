import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cropper, getSortStrategy } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { imagesUrl } from '@constants/index';
import { SortStrategy } from '@enums/index';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entity/product.entity';
import { Favorite } from './entity/favorite.entity';
import { TProductsService } from './types';

@Injectable()
export class ProductsService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private dataSource: DataSource,
  ) { }

  // ! TODO: add isFavorite field for joining another table
  async find({
    categoryIds, groupIds, sort, search,
  }: TProductsService.FindProducts) {
    const qb = this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p');

    if (sort) {
      const [column, direction] = getSortStrategy(sort);
      qb.orderBy(`p.${column}`, direction);
    }

    if (categoryIds) {
      qb.where('p.categoryIds && :categoryIds', { categoryIds });
    }

    if (groupIds) {
      qb.where('p.groupIds && :groupIds', { groupIds });
    }

    if (search) {
      qb.where('p.name LIKE :search', { search: `%${search}%` });
    }

    return qb.getMany();
  }

  // TODO: add feedbacks selection
  // TODO: add feedbacks selection
  async findById(userId: string, id: string) {
    const product = await this.dataSource.createQueryBuilder()
      .select('*')
      .addSelect(
        (subQuery) => subQuery
          .select('f.userId')
          .from(Favorite, 'f')
          .where('f.userId = :userId', { userId })
          .andWhere('f.productId = :productId', { productId: id }),
        'isFavorite',
      )
      .from(Product, 'p')
      .where('p.id = :id', { id })
      .getRawOne();

    return {
      ...product,
      isFavorite: !!product?.isFavorite,
    };
  }

  async findFavorites(userId: string, sort: SortStrategy) {
    const [column, direction] = getSortStrategy(sort);

    return this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p')
      .innerJoin(Favorite, 'f', 'p.id = f.productId')
      .where('f.userId = :userId', { userId })
      .orderBy(`p.${column}`, direction)
      .getMany();
  }

  async addToFavorites(userId: string, productId: string) {
    return this.favoriteRepository.insert({
      userId,
      productId,
    });
  }

  async removeFromFavorites(userId: string, productId: string) {
    return this.favoriteRepository.delete({
      userId,
      productId,
    });
  }

  async save(createProductDto: CreateProductDto, images: Express.Multer.File[]) {
    const productId = randomUUID();

    await Promise.allSettled(images.map(async (image) => {
      const { data, error } = await this.databaseService.database
        .storage
        .from('backets')
        .upload(`images/products/${productId}/${image.originalname}`, await cropper(image.buffer));

      if (error) {
        console.log(error);
      }

      return data;
    }));

    return this.productsRepository
      // TODO createProductDto contain `group_ids` & `category_ids`
      .insert({
        ...createProductDto,
        id: productId,
        groupIds: createProductDto.group_ids.split(','),
        categoryIds: createProductDto.category_ids.split(','),
        images: images.map((img) => `${imagesUrl}/products/${productId}/${img.originalname}`),
      });
  }
}
