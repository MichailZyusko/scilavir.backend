import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { getSortStrategy } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, FindOptionsOrder, Repository } from 'typeorm';
import { imagesUrl } from 'src/constants';
import { SortStrategy } from '../../enums';
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

  // ! TODO: add isFavorite field for joining another table
  async find({ categoryIds, groupIds, sort }: TProductsService.FindProducts) {
    const order: FindOptionsOrder<Product> = {};

    if (sort) {
      const [column, direction] = getSortStrategy(sort);

      order[column] = direction;
    }

    return this.productsRepository.find({
      where: {
        ...(categoryIds && { categoryIds: ArrayContains(categoryIds) }),
        ...(groupIds && { groupIds: ArrayContains(groupIds) }),
      },
      order,
    });
  }

  async findById(userId: string, id: string) {
    // TODO: add isFavorite field
    return this.productsRepository.findOne({
      where: {
        id,
      },
    });
    // return this.productsRepository.query(`
    //   SELECT *, (
    //     SELECT "userId"
    //     FROM favorites AS f
    //     WHERE f."userId" = '${userId}' AND f."productId" = '${id}') AS "isFavorite"
    //   FROM products AS p
    //   WHERE p.id = '${id}'
    // `)[0];

    // const product = await this.productsRepository.createQueryBuilder()
    //   .select('*')
    //   .from(Product, 'products')
    //   .where('products.id = :id', { id })
    //   .addSelect(
    //     (subQuery) => subQuery
    //       .select('favorites.userId')
    //       .from(Favorite, 'favorites')
    //       .where('favorites.userId = :userId', { userId })
    //       .andWhere('favorites.productId = :productId', { productId: id }),
    //     'isFavorite',
    //   )
    //   .getOne();
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

  // ! TODO addToSelect to find by product id
  async findFavoritesById(userId: string, productId: string) {
    const isFavorite = await this.favoriteRepository.exist({
      where: {
        userId,
        productId,
      },
    });

    return { isFavorite };
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
        .upload(`images/${productId}/${image.originalname}`, image.buffer);

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
        images: images.map((img) => `${imagesUrl}/${productId}/${img.originalname}`),
      });
  }
}
