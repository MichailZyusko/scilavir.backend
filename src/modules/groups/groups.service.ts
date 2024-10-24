import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@products/entity/product.entity';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '@modules/database/database.service';
import { cropper } from '@utils/index';
import { imagesUrl } from '@constants/index';
import { Group } from './entity/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    private readonly databaseService: DatabaseService,
  ) { }

  async create(createGroupDto: CreateGroupDto, images: Express.Multer.File[]) {
    const groupId = randomUUID();

    await Promise.allSettled(images.map(async (image) => {
      const { data, error } = await this.databaseService.database
        .storage
        .from('backets')
        .upload(`images/groups/${groupId}/${image.originalname}`, await cropper(image.buffer));

      if (error) {
        console.log(error);
      }

      return data;
    }));

    return this.groupsRepository
      .insert({
        ...createGroupDto,
        id: groupId,
        image: `${imagesUrl}/groups/${groupId}/${images.at(0).originalname}`,
      });
  }

  async find() {
    const groups = await this.groupsRepository
      .createQueryBuilder('g')
      .select('g.id', 'id')
      .addSelect('g.name', 'name')
      .addSelect('g.image', 'image')
      .addSelect('MIN(p.price)', 'minPrice')
      .leftJoin(Product, 'p', 'g.id = ANY(p."groupIds")')
      .groupBy('g.id')
      .addGroupBy('g.name')
      .addGroupBy('g.image')
      .getRawMany();

    return groups.map((group) => ({
      ...group,
      minPrice: group.minPrice
        ? parseFloat(group.minPrice)
        : null,
    }));
  }

  async findOne(id: string) {
    return this.groupsRepository.findOneByOrFail({ id });
  }
}
