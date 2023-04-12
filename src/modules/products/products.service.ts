import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
        images: images.map((img) => `https://hljgruyjewkbrmyedjik.supabase.co/storage/v1/object/public/backets/images/${productId}/${img.originalname}`),
      });

    return data;
  }
}
