/* eslint-disable @typescript-eslint/indent */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GoodDocument = HydratedDocument<Good>;

@Schema()
export class Good {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  img: string;

  @Prop()
  price: number;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const GoodSchema = SchemaFactory.createForClass(Good);
