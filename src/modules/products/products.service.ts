import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cropper, getSortStrategy } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { imagesUrl } from '@constants/index';
import { SortStrategy } from '@enums/index';
import { Cart } from '@modules/cart/entity/cart.entity';
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

  async find(userId: string, {
    categoryIds, groupIds, sort, search,
  }: TProductsService.FindProducts) {
    // const cache = productsMock.get(JSON.stringify({
    //   ...(categoryIds?.length && { categoryIds }),
    //   ...(groupIds?.length && { groupIds }),
    //   ...(sort && { sort }),
    //   ...(search && { search }),
    // }));

    // if (cache) {
    //   return cache;
    // }

    const qb = this.productsRepository.createQueryBuilder('p')
      .select('*');

    if (userId) {
      qb
        .leftJoin(Favorite, 'f', 'p.id = f.productId')
        .addSelect('f.userId', 'f_userId')
        .leftJoin(Cart, 'c', 'p.id = c.productId')
        .addSelect('c.userId', 'c_userId');
    }

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

    const products = await qb.getRawMany();

    return products.map((product) => {
      const {
        f_userId: fUserId,
        c_userId: cUserId,
        userId: uId,
        productId,
        quantity,
        ...payload
      } = product;

      return {
        ...payload,
        ...(fUserId && { isFavorite: true }),
        ...(quantity && { quantity }),
      };
    });
  }

  // TODO: add feedbacks selection
  async findById(userId: string, id: string) {
    const qb = this.productsRepository.createQueryBuilder('p')
      .select('*');

    if (userId) {
      qb
        .leftJoin(Favorite, 'f', 'p.id = f.productId')
        .addSelect('f.userId', 'f_userId')
        .leftJoin(Cart, 'c', 'p.id = c.productId')
        .addSelect('c.userId', 'c_userId');
    }

    const product = await qb
      // .leftJoin(Feedback, 'feedback', 'p.id = feedback.productId')
      .where('p.id = :id', { id })
      .getRawOne();

    const {
      f_userId: fUserId,
      c_userId: cUserId,
      userId: uId,
      productId,
      quantity,
      ...payload
    } = product;

    return {
      ...payload,
      ...(fUserId && { isFavorite: true }),
      ...(quantity && { quantity }),
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
        console.error(error);
      }

      return data;
    }));

    return this.productsRepository
      .insert({
        ...createProductDto,
        id: productId,
        images: images.map((img) => `${imagesUrl}/products/${productId}/${img.originalname}`),
      });
  }
}
