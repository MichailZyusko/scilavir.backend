import { SortStrategy } from 'src/enums';

export const round = (x: number) => Math.round(x * 100) / 100;

export const getSortStrategy = (sort: SortStrategy): readonly [string, { ascending: boolean }] => {
  switch (sort) {
    case SortStrategy.ALPHABETICAL_ASC:
      return ['name', { ascending: true }];
    case SortStrategy.ALPHABETICAL_DESC:
      return ['name', { ascending: false }];
    case SortStrategy.PRICE_ASC:
      return ['price', { ascending: true }];
    case SortStrategy.PRICE_DESC:
      return ['price', { ascending: false }];
    default: throw new Error('Invalid sort strategy');
  }
};
