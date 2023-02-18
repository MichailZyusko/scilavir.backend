import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private configService: ConfigService) { }

  getUsers() {
    return this.configService.getOrThrow<string>('MONGO_DB_URL');
  }
}
