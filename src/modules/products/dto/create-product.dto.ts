export class CreateProductDto {
  name: string;

  article: number;

  description: string;

  price: number;

  categoryIds: string[];

  groupIds: string[];
}
