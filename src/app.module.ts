import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { PATH_TO_STATIC_FOLDER } from './constants';
import { HttpErrorFilter } from './errors/http-error.filter';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/Products.module';
import { MailModule } from './modules/mail/mail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TokenModule } from './modules/token/token.module';
import { UsersModule } from './modules/users/users.module';
import { winstonConf } from './constants/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    ServeStaticModule.forRoot({
      rootPath: PATH_TO_STATIC_FOLDER,
    }),
    WinstonModule.forRoot(winstonConf),
    MongooseModule.forRoot(process.env?.MONGO_DB_URL),
    MailModule,
    UsersModule,
    TokenModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule { }
