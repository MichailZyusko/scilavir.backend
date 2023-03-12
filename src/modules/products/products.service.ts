import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './schema/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) { }

  find() {
    return this.ProductModel.find();
  }

  async save(createProductDto: CreateProductDto, images: Express.Multer.File[]) {
    const product = new this.ProductModel({
      ...createProductDto,
      images: images.map((img) => img.filename),
    });

    return product.save();
  }
}
