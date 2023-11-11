import {
  Body,
  Controller, Get, Param, Post, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Get()
  find() {
    return this.groupsService.find();
  }

  // ! TODO: Add roles guard
  @Post()
  // @UseGuards(RolesGuard)
  // @Roles(Role.admin)
  @UseInterceptors(FilesInterceptor('images', 1))
  create(
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.groupsService.create(createGroupDto, images);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }
}
