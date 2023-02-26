import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { PATH_TO_STATIC_FOLDER } from 'src/constants';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { Good, GoodSchema } from './schema/goods.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Good.name, schema: GoodSchema }]),
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
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule { }
