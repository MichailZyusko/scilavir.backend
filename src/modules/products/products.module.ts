import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { PATH_TO_STATIC_FOLDER } from '../../constants';
import { ProductsController } from './Products.controller';
import { ProductsService } from './Products.service';
import { Product, ProductSchema } from './schema/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: PATH_TO_STATIC_FOLDER,
        filename: (req, file, cb) => {
          const uuid = randomUUID();
          const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));

          return cb(null, `${uuid}${ext}`);
        },

      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
