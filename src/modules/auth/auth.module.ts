import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseStrategy } from './strategies/supabase-auth.strategy';
import { DatabaseModule } from '../database/databse.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthService,
    SupabaseStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule { }
