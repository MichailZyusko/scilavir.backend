import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

@Controller('users')
export class UsersController {
  @Get('self')
  @UseGuards(SupabaseGuard)
  getMyUser(@CurrentUser() user: any) {
    return user;
  }
}
