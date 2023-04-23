import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GroupsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll() {
    return this.databaseService.database
      .from('groups')
      .select()
      .throwOnError();
  }

  async findOne(id: number) {
    return this.databaseService.database
      .from('groups')
      .select()
      .eq('id', id)
      .throwOnError();
  }
}
