import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesModule } from '../boxes/boxes.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card, CardSchema } from './schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    BoxesModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [MongooseModule],
})
export class CardsModule {}
