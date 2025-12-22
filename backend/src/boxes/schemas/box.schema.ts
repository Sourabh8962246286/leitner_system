
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BoxDocument = Box & Document;

/**
 * Represents a single box in the Leitner system.
 * Each box has a level determining its position in the sequence
 * and a schedule for when its cards should be reviewed.
 */
@Schema()
export class Box {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  schedule: string[];

  @Prop({ required: true, unique: true, index: true })
  level: number;
}

export const BoxSchema = SchemaFactory.createForClass(Box);
