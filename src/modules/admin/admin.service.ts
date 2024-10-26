import { DatabaseService } from '@modules/database/database.service';
import { Product } from '@modules/products/entity/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dirname } from 'path';
import * as XLSX from 'xlsx';
import { readdir, readFile } from 'fs/promises';
import { cropper, normalizeName } from '@utils/index';
import { imagesUrl } from '@constants/index';
import { XLSXProduct } from './types';

@Injectable()
export class AdminService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async exportFromExcel(path: string) {
    const imagesPath = `${dirname(path)}/images`;

    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const products = XLSX.utils
      .sheet_to_json<XLSXProduct>(worksheet)
      .map((product) => ({
        ...product,
        groupIds: JSON.parse(product.groupIds),
        categoryIds: JSON.parse(product.categoryIds),
      }));
    console.log('🚀 ~ products:', products.length);

    const items = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const product of products) {
      try {
        const images = await readdir(`${imagesPath}/${product.id}`);

        const res = await Promise.allSettled(images.map(async (image) => {
          try {
            const img = await readFile(`${imagesPath}/${product.id}/${image}`);
            const normalizedName = normalizeName(image);

            const { data, error } = await this.databaseService.database
              .storage
              .from('backets')
              .upload(`images/products/${product.id}/${normalizedName}`, await cropper(img));

            if (error) {
              throw error;
            }

            return data;
          } catch (error) {
            console.error(`product.id - ${product.id}`, error);

            throw error;
          }
        }));

        if (res.filter((item) => item.status === 'rejected').length) {
          console.dir(res.filter((item) => item.status === 'rejected'), { depth: null });
        }

        await this.productsRepository
          .insert({
            ...product,
            images: images.map((img) => `${imagesUrl}/products/${product.id}/${normalizeName(img)}`),
          });
      } catch (error) {
        items.push({ productId: product.id, error });
      }
    }

    return {
      successfulSavedItems: products.length - items.length,
      failedSavedItems: items.length,
      failedIds: items,
      count: products.length,
    };
  }
}