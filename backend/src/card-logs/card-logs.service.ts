import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardLog, CardLogDocument } from './schemas/card-log.schema';

export interface CreateCardLogDto {
  cardId: string;
  userId: string;
  subjectId: string;
  isCorrect: boolean;
  timeSpent: number;
  previousBoxLevel: number;
  newBoxLevel: number;
}

@Injectable()
export class CardLogsService {
  constructor(
    @InjectModel(CardLog.name) private cardLogModel: Model<CardLogDocument>,
  ) {}

  async createLog(createCardLogDto: CreateCardLogDto): Promise<CardLog> {
    const newLog = new this.cardLogModel({
      ...createCardLogDto,
      reviewedAt: new Date(),
    });
    return newLog.save();
  }

  async getLogsForCard(cardId: string, userId: string): Promise<CardLog[]> {
    return this.cardLogModel
      .find({ cardId, userId })
      .sort({ reviewedAt: -1 })
      .exec();
  }

  async getStatsForCard(
    cardId: string,
    userId: string,
  ): Promise<{
    totalReviews: number;
    correctCount: number;
    incorrectCount: number;
    successRate: number;
    totalTimeSpent: number;
  }> {
    const logs = await this.cardLogModel.find({ cardId, userId }).exec();

    const totalReviews = logs.length;
    const correctCount = logs.filter((log) => log.isCorrect).length;
    const incorrectCount = totalReviews - correctCount;
    const successRate =
      totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0;
    const totalTimeSpent = logs.reduce((sum, log) => sum + log.timeSpent, 0);

    return {
      totalReviews,
      correctCount,
      incorrectCount,
      successRate: Math.round(successRate * 100) / 100,
      totalTimeSpent,
    };
  }

  async deleteLogsForCard(cardId: string): Promise<void> {
    await this.cardLogModel.deleteMany({ cardId }).exec();
  }
}
