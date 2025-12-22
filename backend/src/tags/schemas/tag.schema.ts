
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Subject } from '../../subjects/schemas/subject.schema';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subjectId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.index({ userId: 1, subjectId: 1, name: 1 }, { unique: true });
