import { Types } from 'mongoose';

export class GenerateTokenDto {
  userId: Types.ObjectId;

  email: string;
}
