import {
  Body, Controller, Get,
  Param, Post,
} from '@nestjs/common';
import { User } from '@decorators/user.decorator';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) { }

  @Get('/products/:productId')
  findById(@Param('productId') productId: string) {
    return this.feedbacksService.getFeedbacksByProductId(productId);
  }

  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @User() userId: string,
  ) {
    return this.feedbacksService.save(createFeedbackDto, userId);
  }
}
