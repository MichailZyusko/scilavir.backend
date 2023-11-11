import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: remove nullable later
  @Column('int8', { nullable: true })
  article: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float4')
  price: number;

  @Column('text', { array: true })
  images: string[];

  @Column('uuid', { array: true })
  groupIds: string[];

  @Column('uuid', { array: true })
  categoryIds: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
