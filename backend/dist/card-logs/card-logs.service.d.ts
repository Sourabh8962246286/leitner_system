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
export declare class CardLogsService {
    private cardLogModel;
    constructor(cardLogModel: Model<CardLogDocument>);
    createLog(createCardLogDto: CreateCardLogDto): Promise<CardLog>;
    getLogsForCard(cardId: string, userId: string): Promise<CardLog[]>;
    getStatsForCard(cardId: string, userId: string): Promise<{
        totalReviews: number;
        correctCount: number;
        incorrectCount: number;
        successRate: number;
        totalTimeSpent: number;
    }>;
    updateLogTimeSpent(logId: string, userId: string, timeSpent: number): Promise<CardLog>;
    deleteLogsForCard(cardId: string): Promise<void>;
}
