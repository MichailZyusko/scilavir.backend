import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) { }

  async find() {
    // TODO Add min price to each group
    return this.groupsRepository.find({
      select: ['id', 'name'],
    });
  }

  async findOne(id: string) {
    return this.groupsRepository.findOneOrFail({
      where: { id },
    });
  }
}
