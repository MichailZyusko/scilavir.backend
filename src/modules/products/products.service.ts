import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SortStrategy } from 'src/enums';
import { getSortStrategy } from 'src/utils';
import { CreateProductDto } from './dto/create-product.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async find() {
    const { data } = await this.databaseService.database
      .from('products')
      .select()
      .throwOnError();

    return data;
  }

  async findById(id: string) {
    const { data } = await this.databaseService.database
      .from('products')
      .select()
      .eq('id', id)
      .single()
      .throwOnError();

    return data;
  }

  async findFavorites(userId: string, sort: SortStrategy) {
    const [column, direction] = getSortStrategy(sort);
    const { data } = await this.databaseService.database
      .from('favorites')
      .select('products (*)')
      .eq('user_id', userId)
      .throwOnError();

    return data
      .map((item) => item.products)
      // eslint-disable-next-line no-nested-ternary
      .sort((a, b) => (direction.ascending
        ? (a[column] < b[column] ? -1 : 1)
        : (a[column] > b[column] ? -1 : 1)));
  }

  async findFavoritesById(userId: string, productId: string) {
    const { data: product } = await this.databaseService.database
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    return { isFavorite: !!product };
  }

  async addToFavorites(userId: string, productId: string) {
    const { data } = await this.databaseService.database
      .from('favorites')
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .throwOnError();

    return data;
  }

  async removeFromFavorites(userId: string, productId: string) {
    const { data } = await this.databaseService.database
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .throwOnError();

    return data;
  }

  async findByCategory(categoryId: string, sort: SortStrategy) {
    const [column, direction] = getSortStrategy(sort);
    const { data: products } = await this.databaseService.database
      .from('products')
      .select()
      .contains('category_ids', [categoryId])
      .order(column, direction)
      .throwOnError();

    return products;
  }

  async findByGroup(groupId: string, sort: SortStrategy) {
    const [column, direction] = getSortStrategy(sort);
    const { data: products } = await this.databaseService.database
      .from('products')
      .select()
      .contains('group_ids', [groupId])
      .order(column, direction)
      .throwOnError();

    return products;
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

    const { data } = await this.databaseService.database
      .from('products')
      .insert({
        ...createProductDto,
        id: productId,
        group_ids: createProductDto.group_ids.split(','),
        category_ids: createProductDto.category_ids.split(','),
        images: images.map((img) => `https://hljgruyjewkbrmyedjik.supabase.co/storage/v1/object/public/backets/images/${productId}/${img.originalname}`),
      });

    return data;
  }
}
