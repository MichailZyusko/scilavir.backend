import {
  MiddlewareConsumer, Module, NestModule, RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '@products/products.module';
import { MailModule } from '@mail/mail.module';
import { OrdersModule } from '@orders/orders.module';
import { UsersModule } from '@users/users.module';
import { CategoriesModule } from '@categories/categories.module';
import { GroupsModule } from '@groups/groups.module';
import { CartModule } from '@cart/cart.module';
import { winstonConf } from '@constants/winston.config';
import { HttpErrorFilter } from '@errors/http-error.filter';
import { FeedbacksModule } from '@modules/feedbacks/feedbacks.module';
import { AdminModule } from '@modules/admin/admin.module';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.prod'],
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    autoLoadEntities: true,
    logging: ['error'],
    cache: true,
    ...(process.env.NODE_ENV !== 'prod' && { synchronize: true }),
  }),
  WinstonModule.forRoot(winstonConf),
  MailModule,
  UsersModule,
  ProductsModule,
  OrdersModule,
  CategoriesModule,
  GroupsModule,
  CategoriesModule,
  GroupsModule,
  DatabaseModule,
  CartModule,
  FeedbacksModule,
  ...(process.env.NODE_ENV !== 'prod' ? [AdminModule] : []),
];

@Module({
  imports,
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClerkExpressWithAuth())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
