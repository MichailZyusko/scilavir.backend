import { Controller, Get } from '@nestjs/common';
import { getUserById } from 'src/utils';
import { User } from '../../decorators/user.decorator';

@Controller('users')
export class UsersController {
  @Get('self')
  async getMyUser(@User() userId: string) {
    return getUserById(userId);
  }
}
