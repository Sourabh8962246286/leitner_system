import { Module } from '@nestjs/common';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { DatabaseModule } from './database/database.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [DatabaseModule, BoxesModule, CardsModule, TagsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
