import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { EmailService } from '../notifications/email.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly emailService: EmailService,
  ) {}

  @Cron('0 9 * * *')
  async sendDailyReminders(): Promise<void> {
    this.logger.log('Running daily reminder cron job...');

    const users = await this.usersService.findAll();

    for (const user of users) {
      const subjectSummary =
        await this.cardsService.getDueCardsGroupedBySubject(
          user._id.toString(),
        );

      if (subjectSummary.length === 0) continue;

      const totalCards = subjectSummary.reduce((sum, s) => sum + s.count, 0);

      await this.emailService.sendDailyReminder(user.email, {
        userName: user.name,
        totalCards,
        subjectSummary,
      });
    }

    this.logger.log(`Daily reminders sent to ${users.length} user(s).`);
  }
}
