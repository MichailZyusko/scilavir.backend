import { DatabaseService } from '@modules/database/database.service';
import { Product } from '@modules/products/entity/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dirname } from 'path';
import * as XLSX from 'xlsx';
import { readdir, readFile } from 'fs/promises';
import { cropper } from '@utils/index';
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

    const items = await Promise.allSettled(products.map(async (product) => {
      const images = await readdir(`${imagesPath}/${product.id}`);

      await Promise.allSettled(images.map(async (image) => {
        const img = await readFile(`${imagesPath}/${product.id}/${image}`);

        const { data, error } = await this.databaseService.database
          .storage
          .from('backets')
          .upload(`images/products/${product.id}/${image}`, await cropper(img));

        if (error) {
          console.error(error);

          throw error;
        }

        return data;
      }));

      await this.productsRepository
        .insert({
          ...product,
          images: images.map((img) => `${images}/products/${product.id}/${img}`),
        });
    }));

    return {
      successfulSavedItems: items.filter((item) => item.status === 'fulfilled').length,
      failedSavedItems: items.filter((item) => item.status === 'rejected').length,
      failedIds: items
        .flatMap((item, idx) => {
          if (item.status === 'rejected') {
            return [{ id: products[idx].id, reason: item.reason }];
          }

          return [];
        }),
      count: products.length,
    };
  }
}
