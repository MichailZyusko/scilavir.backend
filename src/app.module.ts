import {
  MiddlewareConsumer, Module, NestModule, RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
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
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
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
      logging: ['query'],
      cache: {
        duration: 60_000,
      },
      synchronize: true,
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
  ],
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
    // Define private routes
    consumer
      .apply(ClerkExpressRequireAuth())
      .exclude(
        { path: '/ping', method: RequestMethod.GET },
        { path: '/groups', method: RequestMethod.GET },
        { path: '/categories', method: RequestMethod.GET },
        { path: '/groups/(.*)', method: RequestMethod.GET },
        { path: '/categories/(.*)', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Define public routes
    consumer
      .apply(ClerkExpressWithAuth())
      .forRoutes(
        { path: '/products', method: RequestMethod.GET },
        { path: '/products/(.*)', method: RequestMethod.GET },
      );
  }
}
