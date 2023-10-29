import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './entity/feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
  ) { }

  async save(createFeedbackDto: CreateFeedbackDto, userId: string) {
    return this.feedbacksRepository.insert({
      ...createFeedbackDto,
      userId,
    });
  }

  async getFeedbacksByProductId(productId: string) {
    return this.feedbacksRepository.find({
      where: { productId },
      order: {
        createdAt: -1,
      },
    });
  }
}
