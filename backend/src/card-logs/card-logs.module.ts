import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardLog, CardLogSchema } from './schemas/card-log.schema';
import { CardLogsService } from './card-logs.service';
import { CardLogsController } from './card-logs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CardLog.name, schema: CardLogSchema }]),
  ],
  controllers: [CardLogsController],
  providers: [CardLogsService],
  exports: [CardLogsService],
})
export class CardLogsModule {}
