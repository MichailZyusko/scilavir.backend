import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cropper, getSortStrategy } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { imagesUrl } from '@constants/index';
import { Cart } from '@modules/cart/entity/cart.entity';
import _ from 'lodash';
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

    if (limit) {
      qb.limit(limit);
    }

    if (offset) {
      qb.offset(offset);
    }

    const products = await qb.getRawMany();

    // ! FIXME delete _.uniqBy
    return _.uniqBy(products, 'id')
      .map((product) => {
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

  async findFavorites(userId: string, { sort, limit, offset }: TProductsService.FindFavorites) {
    const qb = this.productsRepository.createQueryBuilder()
      .select('p')
      .from(Product, 'p')
      .innerJoin(Favorite, 'f', 'p.id = f.productId')
      .where('f.userId = :userId', { userId });

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      qb.orderBy(`p.${column}`, direction);
    }

    if (limit) {
      qb.limit(limit);
    }

    if (offset) {
      qb.offset(offset);
    }

    return qb.getMany();
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
