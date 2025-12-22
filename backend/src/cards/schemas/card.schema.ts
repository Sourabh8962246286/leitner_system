
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Box } from '../../boxes/schemas/box.schema';
import { Tag } from '../../tags/schemas/tag.schema';
import { Subject } from '../../subjects/schemas/subject.schema';

export type CardDocument = Card & mongoose.Document;

/**
 * Represents a single flashcard in the Leitner system.
 * Each card has a front and back, belongs to a current box,
 * and tracks its last review date.
 */
@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true })
  currentBoxId: Box;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subjectId: string;

  @Prop()
  lastReviewed: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];

  @Prop({ type: String })
  color: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
