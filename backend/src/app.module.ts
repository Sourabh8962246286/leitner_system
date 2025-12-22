import { Module } from '@nestjs/common';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { DatabaseModule } from './database/database.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [DatabaseModule, BoxesModule, CardsModule, TagsModule, SubjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
