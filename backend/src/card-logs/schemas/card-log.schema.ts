import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Card } from '../../cards/schemas/card.schema';
import { Subject } from '../../subjects/schemas/subject.schema';

export type CardLogDocument = CardLog & mongoose.Document;

/**
 * Represents a log entry for a card review in the Leitner system.
 * Each entry tracks a review attempt with result and time spent.
 */
@Schema({ timestamps: true })
export class CardLog {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
    index: true,
  })
  cardId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subjectId: string;

  @Prop({ required: true })
  isCorrect: boolean;

  @Prop({ default: 0 })
  timeSpent: number; // in seconds from manual timer, 0 if timer wasn't used

  @Prop({ required: true })
  previousBoxLevel: number;

  @Prop({ required: true })
  newBoxLevel: number;

  @Prop({ default: Date.now })
  reviewedAt: Date;
}

export const CardLogSchema = SchemaFactory.createForClass(CardLog);

// Compound indexes for query optimization
CardLogSchema.index({ cardId: 1, userId: 1, reviewedAt: -1 }); // logs retrieval with sort
CardLogSchema.index({ userId: 1, subjectId: 1, reviewedAt: -1 }); // stats by subject
