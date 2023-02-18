import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(private mailService: MailService) { }

  async getUsers() {
    await this.mailService.sendUserConfirmation();
    return 'Mail send successfully';
  }
}
