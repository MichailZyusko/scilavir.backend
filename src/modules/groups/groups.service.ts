import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { Product } from '../products/entity/product.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async find() {
    // TODO Add min price to each group

    const [groups, products] = await Promise.all([
      this.groupsRepository.find({
        select: ['id', 'name'],
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
    return this.productsRepository.findOne({
      where: { id },
    });
  }
}
