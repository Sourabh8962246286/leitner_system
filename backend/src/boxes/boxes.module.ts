import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { Box, BoxSchema } from './schemas/box.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }])],
  controllers: [BoxesController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
