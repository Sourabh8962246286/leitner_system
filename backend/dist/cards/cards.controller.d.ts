import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
export declare class CardsController {
    private readonly cardsService;
    constructor(cardsService: CardsService);
    create(createCardDto: CreateCardDto): Promise<import("./schemas/card.schema").Card>;
    findAll(tags?: string): Promise<import("./schemas/card.schema").Card[]>;
    handleReview(reviewCardDto: ReviewCardDto): Promise<import("./schemas/card.schema").Card>;
    update(id: string, updateCardDto: UpdateCardDto): Promise<import("./schemas/card.schema").Card>;
    delete(id: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
