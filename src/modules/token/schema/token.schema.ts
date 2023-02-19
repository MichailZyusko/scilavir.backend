/* eslint-disable @typescript-eslint/indent */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
