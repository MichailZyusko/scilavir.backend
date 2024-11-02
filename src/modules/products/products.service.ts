import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { cropper, getSortStrategy } from '@utils/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { imagesUrl } from '@constants/index';
import { Feedback } from '@modules/feedbacks/entity/feedback.entity';
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

  async find(userId: string, params: TProductsService.FindProducts) {
    const {
      categoryIds, groupIds, sort, ids, search, limit = 12, offset = 0,
    } = params;

    const baseQB = this.productsRepository.createQueryBuilder('p')
      .select([
        'p.id AS id', 'p.name AS name', 'p.price AS price', 'p.images AS images',
      ]);

    if (userId) {
      baseQB
        .leftJoin(Favorite, 'f', 'p.id = f.productId AND f.userId = :userId', { userId })
        .addSelect('f.userId', 'f_userId');

      // TODO: uncomment when cart will be implemented
      // .leftJoin(Cart, 'c', 'p.id = c.productId AND c.userId = :userId', { userId })
      // .addSelect('c.userId', 'c_userId');
    }

    if (categoryIds) {
      baseQB.andWhere('p.categoryIds && :categoryIds', { categoryIds });
    }

    if (groupIds) {
      baseQB.andWhere('p.groupIds && :groupIds', { groupIds });
    }

    if (ids) {
      baseQB.andWhere('p.id = ANY(:ids)', { ids });
    }

    if (search) {
      baseQB.andWhere('p.name LIKE :search', { search: `%${search}%` });
    }

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      baseQB.orderBy(`p.${column}`, direction);
    }

    const [products, count] = await Promise.all([
      baseQB
        .take(limit)
        .skip(offset)
        .getRawMany(),
      baseQB.getCount(),
    ]);

    // TODO: remove comments once cart will be implemented
    return {
      count,
      data: products.map((product) => {
        const {
          f_userId: fUserId,
          // c_userId: cUserId,
          userId: uId,
          productId,
          // quantity,
          ...payload
        } = product;

        return {
          ...payload,
          ...(fUserId && { isFavorite: true }),
          // ...(quantity && { quantity }),
        };
      }),
    };
  }

  async findById(userId: string, id: string) {
    const results = await this.productsRepository.createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p.name AS name',
        'p.price AS price',
        'p.images AS images',
        'p.description AS description',
        'p.categoryIds AS categoryIds',
        'p.article AS article',
        'f.userId AS f_userId',
        'fb.id AS fb_id',
        'fb.title AS fb_title',
        'fb.description AS fb_description',
        'fb.rating AS fb_rating',
      ])
      .leftJoin(Favorite, 'f', 'f.productId = p.id AND f.userId = :userId', { userId })
      .leftJoin(Feedback, 'fb', 'fb.productId = p.id')
      .where('p.id = :id', { id })
      .getRawMany();

    if (results.length === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const [firstResult] = results;
    const feedbacks = results
      .filter((result) => result.fb_id)
      .map((result) => ({
        id: result.fb_id,
        title: result.fb_title,
        description: result.fb_description,
        rating: result.fb_rating,
      }));

    return {
      id: firstResult.id,
      name: firstResult.name,
      price: firstResult.price,
      images: firstResult.images,
      description: firstResult.description,
      categoryIds: firstResult.categoryids,
      article: firstResult.article,
      isFavorite: !!firstResult.f_userid,
      feedbacks,
    };
  }

  async findFavorites(
    userId: string,
    { sort, limit = 12, offset = 0 }: TProductsService.FindFavorites,
  ) {
    const qb = this.productsRepository.createQueryBuilder('p')
      .select([
        'p.id AS id', 'p.name AS name', 'p.price AS price', 'p.images AS images',
      ])
      .innerJoin(Favorite, 'f', 'p.id = f.productId')
      .where('f.userId = :userId', { userId });

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      qb.orderBy(`p.${column}`, direction);
    }

    const [favorites, count] = await Promise.all([
      qb
        .take(limit)
        .skip(offset)
        .getRawMany(),
      qb.getCount(),
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
