import {
  MiddlewareConsumer, Module, NestModule, RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { AppController } from './app.controller';
import { HttpErrorFilter } from './errors/http-error.filter';
import { ProductsModule } from './modules/products/products.module';
import { MailModule } from './modules/mail/mail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { winstonConf } from './constants/winston.config';
import { DatabaseModule } from './modules/database/database.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    WinstonModule.forRoot(winstonConf),
    MailModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    GroupsModule,
    DatabaseModule,
    CartModule,
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
    consumer
      .apply(ClerkExpressRequireAuth())
      .exclude(
        { path: '/products', method: RequestMethod.GET },
        { path: '/groups', method: RequestMethod.GET },
        { path: '/categories', method: RequestMethod.GET },
        { path: '/groups/(.*)', method: RequestMethod.GET },
        { path: '/categories/(.*)', method: RequestMethod.GET },
        // { path: '/products/(.*)', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
