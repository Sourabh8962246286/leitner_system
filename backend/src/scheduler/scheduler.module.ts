import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [NotificationsModule, UsersModule, CardsModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
