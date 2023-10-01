import { users } from '@clerk/clerk-sdk-node';
import { SortStrategy } from 'src/enums';

export const round = (x: number) => Math.round(x * 100) / 100;

export const getSortStrategy = (sort: SortStrategy): readonly [string, 'ASC' | 'DESC'] => {
  switch (sort) {
    case SortStrategy.ALPHABETICAL_ASC:
      return ['name', 'ASC'];
    case SortStrategy.ALPHABETICAL_DESC:
      return ['name', 'DESC'];
    case SortStrategy.PRICE_ASC:
      return ['price', 'ASC'];
    case SortStrategy.PRICE_DESC:
      return ['price', 'DESC'];
    default: throw new Error('Invalid sort strategy');
  }
};

export const getUserById = async (id: string) => users.getUser(id);
