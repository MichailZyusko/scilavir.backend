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

    const { data: products } = await this.databaseService.database
      .from('products')
      .select('group_ids, price')
      .throwOnError();

    const mappedGroups = groups.map(({ id, ...group }) => ({
      ...group,
      id,
      minPrice: products.reduce((acc, product) => {
        if (product.group_ids.includes(id)) {
          return acc < product.price ? acc : product.price;
        }

        return acc;
      }, Infinity),
    }));

    return mappedGroups;
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
