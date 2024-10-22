export class CreateProductDto {
  name: string;

  article: string;

  description: string;

  price: number;

  categoryIds: string[];

  groupIds: string[];
}
