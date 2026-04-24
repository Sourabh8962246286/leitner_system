import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoxesService } from '../boxes/boxes.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { Card, CardDocument } from './schemas/card.schema';

/**
 * Service for managing cards and the core Leitner system logic.
 */
@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private readonly boxesService: BoxesService,
  ) {}

  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const firstBox = await this.boxesService.findByLevel(1);
    if (!firstBox) {
      throw new NotFoundException(
        'Box with level 1 not found. Cannot create card.',
      );
    }

    const newCard = new this.cardModel({
      ...createCardDto,
      userId,
      currentBoxId: firstBox._id,
    });

    return newCard.save();
  }

  async findAll(
    userId: string,
    tagIds?: string[],
    subjectId?: string,
  ): Promise<Card[]> {
    const filter: any = { userId };
    if (tagIds && tagIds.length > 0) {
      filter.tags = { $all: tagIds };
    }
    if (subjectId) {
      filter.subjectId = subjectId;
    }
    return this.cardModel.find(filter).exec();
  }

  async handleReview(
    reviewCardDto: ReviewCardDto,
    userId: string,
  ): Promise<Card> {
    const { cardId, isCorrect } = reviewCardDto;

    const card = await this.cardModel
      .findOne({ _id: cardId, userId })
      .populate('currentBoxId')
      .exec();

    if (!card) {
      throw new ForbiddenException(
        'Card not found or you do not have permission.',
      );
    }

    const currentBox = card.currentBoxId as any;
    const currentLevel = currentBox.level;
    let nextBox;

    if (isCorrect) {
      nextBox = await this.boxesService.findByLevel(currentLevel + 1);
      if (!nextBox) {
        nextBox = currentBox;
      }
    } else {
      nextBox = await this.boxesService.findByLevel(1);
      if (!nextBox) {
        throw new NotFoundException('Box with level 1 not found.');
      }
    }

    card.currentBoxId = nextBox._id;
    card.lastReviewed = new Date();

    return card.save();
  }

  async update(
    cardId: string,
    updateCardDto: UpdateCardDto,
    userId: string,
  ): Promise<Card> {
    const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();
    if (!card) {
      throw new ForbiddenException(
        'Card not found or you do not have permission.',
      );
    }

    const updatedCard = await this.cardModel
      .findByIdAndUpdate(cardId, updateCardDto, { new: true })
      .exec();

    if (!updatedCard) {
      throw new NotFoundException(`Card with ID "${cardId}" not found`);
    }

    return updatedCard;
  }

  async delete(
    cardId: string,
    userId: string,
  ): Promise<{ deleted: boolean; _id: string }> {
    const card = await this.cardModel.findOne({ _id: cardId, userId }).exec();
    if (!card) {
      throw new ForbiddenException(
        'Card not found or you do not have permission.',
      );
    }

    const result = await this.cardModel.deleteOne({ _id: cardId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Card with ID "${cardId}" not found`);
    }
    return { deleted: true, _id: cardId };
  }

  async getDueCardsGroupedBySubject(
    userId: string,
  ): Promise<{ subjectName: string; count: number }[]> {
    const now = new Date();
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = dayNames[now.getDay()];
    const todayDate = now.getDate();

    const cards = await this.cardModel
      .find({ userId })
      .populate('currentBoxId')
      .populate('subjectId')
      .exec();

    const dueCards = cards.filter((card) => {
      const box = card.currentBoxId as any;
      const schedule: string[] = box?.schedule ?? [];

      // Skip if already reviewed today
      if (card.lastReviewed) {
        const last = new Date(card.lastReviewed);
        const reviewedToday =
          last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate();
        if (reviewedToday) return false;
      }

      for (const entry of schedule) {
        if (entry === 'Everyday') return true;
        if (entry === todayName) return true;
        if (entry === 'Every other Saturday' && todayName === 'Saturday') {
          if (!card.lastReviewed) return true;
          const daysSince =
            (now.getTime() - new Date(card.lastReviewed).getTime()) / 86400000;
          if (daysSince >= 7) return true;
        }
        if (
          entry === 'First Sunday of the month' &&
          todayName === 'Sunday' &&
          todayDate <= 7
        ) {
          return true;
        }
      }
      return false;
    });

    // Group by subject name
    const grouped = new Map<string, number>();
    for (const card of dueCards) {
      const subject = card.subjectId as any;
      const name: string = subject?.name ?? 'Unknown';
      grouped.set(name, (grouped.get(name) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([subjectName, count]) => ({
      subjectName,
      count,
    }));
  }
}
