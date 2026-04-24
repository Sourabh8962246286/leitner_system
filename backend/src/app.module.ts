import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: [
        '/auth/{*path}',
        '/boxes/{*path}',
        '/cards/{*path}',
        '/subjects/{*path}',
        '/tags/{*path}',
      ],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BoxesModule,
    CardsModule,
    TagsModule,
    SubjectsModule,
    NotificationsModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
