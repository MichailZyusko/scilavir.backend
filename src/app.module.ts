import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { HttpErrorFilter } from './errors/http-error.filter';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { MailModule } from './modules/mail/mail.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { winstonConf } from './constants/winston.config';
import { DatabaseModule } from './modules/database/databse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    WinstonModule.forRoot(winstonConf),
    MailModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    DatabaseModule,
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
