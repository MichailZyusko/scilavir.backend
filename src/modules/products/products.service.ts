import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cropper, getSortStrategy } from '@utils/index';
import { cropper, getSortStrategy } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repository } from 'typeorm';
import { imagesUrl } from '@constants/index';
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
  ) { }

  async find(userId: string, {
    categoryIds, groupIds, sort,
    search, limit, offset,
  }: TProductsService.FindProducts) {
    // const cache = productsMock.get(JSON.stringify({
    //   ...(categoryIds?.length && { categoryIds }),
    //   ...(groupIds?.length && { groupIds }),
    //   ...(sort && { sort }),
    //   ...(search && { search }),
    // }));

    // if (cache) {
    //   return { count: 2, products: cache };
    // }

    const productsQB = this.productsRepository.createQueryBuilder('p')
      .select('*');
    const countQB = this.productsRepository.createQueryBuilder('p')
      .select('*');

    if (userId) {
      productsQB
        .leftJoin(Favorite, 'f', 'p.id = f.productId')
        .addSelect('f.userId', 'f_userId')
        .leftJoin(Cart, 'c', 'p.id = c.productId')
        .addSelect('c.userId', 'c_userId');
    }

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      productsQB.orderBy(`p.${column}`, direction);
    }

    if (categoryIds) {
      productsQB.where('p.categoryIds && :categoryIds', { categoryIds });
      countQB.where('p.categoryIds && :categoryIds', { categoryIds });
    }

    if (groupIds) {
      productsQB.where('p.groupIds && :groupIds', { groupIds });
      countQB.where('p.groupIds && :groupIds', { groupIds });
    }

    if (search) {
      productsQB.where('p.name LIKE :search', { search: `%${search}%` });
      countQB.where('p.name LIKE :search', { search: `%${search}%` });
    }

    if (limit) {
      productsQB.limit(limit);
    }

    if (offset) {
      productsQB.offset(offset);
    }

    const [products, count] = await Promise.all([
      productsQB.getRawMany(),
      countQB.getCount(),
    ]);

    return {
      count,
      data: products.map((product) => {
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
      }),
    };
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
      ...payload,
      ...(fUserId && { isFavorite: true }),
      ...(quantity && { quantity }),
    };
  }

  async findFavorites(userId: string, { sort, limit, offset }: TProductsService.FindFavorites) {
    const favoritesQB = this.productsRepository.createQueryBuilder('p')
      .select('*')
      .innerJoin(Favorite, 'f', 'p.id = f.productId')
      .where('f.userId = :userId', { userId });
    const countQB = this.productsRepository.createQueryBuilder('p')
      .select('*')
      .innerJoin(Favorite, 'f', 'p.id = f.productId')
      .where('f.userId = :userId', { userId });

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      favoritesQB.orderBy(`p.${column}`, direction);
    }

    if (limit) {
      favoritesQB.limit(limit);
    }

    if (offset) {
      favoritesQB.offset(offset);
    }

    const [favorites, count] = await Promise.all([
      favoritesQB.getRawMany(),
      countQB.getCount(),
    ]);

    return {
      data: favorites,
      count,
    };
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
        .upload(`images/products/${productId}/${image.originalname}`, await cropper(image.buffer));

      if (error) {
        console.error(error);
        console.error(error);
      }

      return data;
    }));

    return this.productsRepository
      .insert({
        ...createProductDto,
        id: productId,
        images: images.map((img) => `${imagesUrl}/products/${productId}/${img.originalname}`),
        images: images.map((img) => `${imagesUrl}/products/${productId}/${img.originalname}`),
      });
  }
}
