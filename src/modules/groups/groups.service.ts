import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@products/entity/product.entity';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '@modules/database/database.service';
import { cropper } from '@utils/index';
import { imagesUrl } from '@constants/index';
import { groupsMock } from '@modules/groups/mock/groups.mock';
import { Group } from './entity/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
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
    // TODO Add min price to each group via SQL query

    const [groups, products] = await Promise.all([
      this.groupsRepository.find({
        select: ['id', 'name', 'image'],
      }),
      this.productsRepository.find({
        select: ['groupIds', 'price'],
      }),
    ]);

    return groups.map(({ id, ...group }) => ({
      ...group,
      id,
      minPrice: products.reduce((acc, product) => {
        if (product.groupIds.includes(id)) {
          return acc < product.price ? acc : product.price;
        }

        return acc;
      }, Infinity),
    }));
  }

  async findOne(id: string) {
    const cache = groupsMock.get(id);
    if (cache) {
      return cache;
    }

    return this.groupsRepository.findOne({
      where: { id },
    });
  }
}
