import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Creates a new card and places it in the first box.
   * @param createCardDto The DTO containing the card's front and back content.
   * @returns The newly created card document.
   */
  async create(createCardDto: CreateCardDto): Promise<Card> {
    const firstBox = await this.boxesService.findByLevel(1);
    if (!firstBox) {
      throw new NotFoundException('Box with level 1 not found. Cannot create card.');
    }

    const newCard = new this.cardModel({
      ...createCardDto,
      currentBoxId: firstBox._id,
    });

    return newCard.save();
  }

  /**
   * Retrieves all cards from the database, optionally filtered by tags.
   * @param tagIds An array of tag IDs to filter by.
   * @returns A promise that resolves to an array of all cards.
   */
  async findAll(tagIds?: string[]): Promise<Card[]> {
    const filter = {};
    if (tagIds && tagIds.length > 0) {
      filter['tags'] = { $all: tagIds };
    }
    return this.cardModel.find(filter).exec();
  }

  /**
   * The core "Leitner Engine". Handles a card review, moving it to the
   * correct box based on whether the user's answer was correct.
   * @param reviewCardDto The DTO containing the card ID and correctness flag.
   * @returns The updated card document.
   */
  async handleReview(reviewCardDto: ReviewCardDto): Promise<Card> {
    const { cardId, isCorrect } = reviewCardDto;

    // 1. Find the card and populate its current box details
    const card = await this.cardModel.findById(cardId).populate('currentBoxId').exec();
    if (!card) {
      throw new NotFoundException(`Card with ID "${cardId}" not found`);
    }

    // The populated 'currentBoxId' is a full Box document.
    // We need to cast it to access the 'level' property.
    const currentBox = card.currentBoxId as any; 
    const currentLevel = currentBox.level;
    let nextBox;

    if (isCorrect) {
      // 2. If correct, find the box with the next level
      console.log(`Correct: Card in Box ${currentLevel}. Moving to next box.`);
      nextBox = await this.boxesService.findByLevel(currentLevel + 1);
      // If there is no next box, it stays in the current (final) box.
      if (!nextBox) {
        console.log(`Correct: Card is in the final box.`);
        nextBox = currentBox;
      }
    } else {
      // 3. If incorrect, find the box for level 1
      console.log(`Incorrect: Card in Box ${currentLevel}. Moving to Box 1.`);
      nextBox = await this.boxesService.findByLevel(1);
      if (!nextBox) {
        // This would be a critical setup error.
        throw new NotFoundException('Box with level 1 not found.');
      }
    }

    // 4. Update the card's box and review date
    card.currentBoxId = nextBox._id;
    card.lastReviewed = new Date();
    
    return card.save();
  }

  /**
   * Updates a card's content.
   * @param cardId The ID of the card to update.
   * @param updateCardDto The DTO with the updated data.
   * @returns The updated card document.
   */
  async update(cardId: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const updatedCard = await this.cardModel.findByIdAndUpdate(
      cardId,
      updateCardDto,
      { new: true },
    ).exec();

    if (!updatedCard) {
      throw new NotFoundException(`Card with ID "${cardId}" not found`);
    }

    return updatedCard;
  }

  /**
   * Deletes a card from the database.
   * @param cardId The ID of the card to delete.
   */
  async delete(cardId: string): Promise<{ deleted: boolean; _id: string }> {
    const result = await this.cardModel.deleteOne({ _id: cardId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Card with ID "${cardId}" not found`);
    }
    return { deleted: true, _id: cardId };
  }
}