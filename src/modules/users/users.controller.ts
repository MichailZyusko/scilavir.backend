import {
  Body, Controller, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './users.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Get()
  @UseGuards(AccessTokenGuard)
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('self')
  @UseGuards(SupabaseGuard)
  getMyUser(@CurrentUser() user: any) {
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  patchUser(
    @Param('id') id: string,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.userService.patch(id, patchUserDto);
  }
}
