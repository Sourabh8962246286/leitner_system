import { Model } from 'mongoose';
import { BoxesService } from '../boxes/boxes.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { Card, CardDocument } from './schemas/card.schema';
export declare class CardsService {
    private cardModel;
    private readonly boxesService;
    constructor(cardModel: Model<CardDocument>, boxesService: BoxesService);
    create(createCardDto: CreateCardDto, userId: string): Promise<Card>;
    findAll(userId: string, tagIds?: string[], subjectId?: string): Promise<Card[]>;
    handleReview(reviewCardDto: ReviewCardDto, userId: string): Promise<Card>;
    update(cardId: string, updateCardDto: UpdateCardDto, userId: string): Promise<Card>;
    delete(cardId: string, userId: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
    getDueCardsGroupedBySubject(userId: string): Promise<{
        subjectName: string;
        count: number;
    }[]>;
}
