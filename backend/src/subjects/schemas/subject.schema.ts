
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SubjectDocument = Subject & mongoose.Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });
