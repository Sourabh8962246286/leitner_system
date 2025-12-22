
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/leitner-system'),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
