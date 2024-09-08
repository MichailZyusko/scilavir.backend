import { Controller, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('excel')
  exportFromExcel(@Query('path') path: string) {
    return this.adminService.exportFromExcel(path);
  }
}
