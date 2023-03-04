import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { PATH_TO_STATIC_FOLDER } from './constants';
import { HttpErrorFilter } from './errors/http-error.filter';
import { AuthModule } from './modules/auth/auth.module';
import { GoodsModule } from './modules/goods/goods.module';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.prod'],
    }),
    ServeStaticModule.forRoot({
      rootPath: PATH_TO_STATIC_FOLDER,
    }),
    MongooseModule.forRoot(process.env?.MONGO_DB_URL),
    MailModule,
    UsersModule,
    TokenModule,
    AuthModule,
    GoodsModule,
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
