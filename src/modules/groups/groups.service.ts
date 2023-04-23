import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GroupsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll() {
    const { data: groups } = await this.databaseService.database
      .from('groups')
      .select('id, name')
      .throwOnError();

    return groups;
  }

  async findOne(id: string) {
    const { data: group } = await this.databaseService.database
      .from('groups')
      .select()
      .eq('id', id)
      .single()
      .throwOnError();

    return group;
  }
}
