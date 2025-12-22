import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BoxesModule,
    CardsModule,
    TagsModule,
    SubjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
