import {
  Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../guards/role.guard';
import { Roles } from '../../decorators/role.decorator';
import { Role } from '../users/enums/users.enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './Products.service';
import { SupabaseGuard } from '../auth/guards/supabase-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,

  ) { }

  @Get()
  @UseGuards(SupabaseGuard)
  find() {
    return this.productsService.find();
  }

  @Post()
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productsService.save(createProductDto, images);
  }
}
