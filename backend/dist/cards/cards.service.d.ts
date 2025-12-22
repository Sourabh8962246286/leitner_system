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
    create(createCardDto: CreateCardDto): Promise<Card>;
    findAll(tagIds?: string[]): Promise<Card[]>;
    handleReview(reviewCardDto: ReviewCardDto): Promise<Card>;
    update(cardId: string, updateCardDto: UpdateCardDto): Promise<Card>;
    delete(cardId: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
