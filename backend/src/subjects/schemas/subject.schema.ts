
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type SubjectDocument = Subject & mongoose.Document;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true, unique: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
