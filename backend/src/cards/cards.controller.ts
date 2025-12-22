
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

/**
 * Controller for handling HTTP requests related to cards.
 */
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Handles POST requests to /cards.
   * Creates a new card.
   * @param createCardDto The request body, validated by ValidationPipe.
   * @returns The newly created card document.
   */
  @Post()
  create(@Body(new ValidationPipe()) createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  /**
   * Handles GET requests to /cards.
   * Returns a list of all cards, optionally filtered by tags.
   * @param tags A comma-separated string of tag IDs.
   */
  @Get()
  findAll(@Query('tags') tags?: string) {
    const tagIds = tags ? tags.split(',') : [];
    return this.cardsService.findAll(tagIds);
  }

  /**
   * Handles POST requests to /cards/review.
   * Accepts a cardId and a boolean indicating if the review was correct.
   * Uses the Leitner engine in CardsService to move the card.
   * @param reviewCardDto The request body, validated by ValidationPipe.
   * @returns The updated card document.
   */
  @Post('review')
  handleReview(@Body(new ValidationPipe()) reviewCardDto: ReviewCardDto) {
    return this.cardsService.handleReview(reviewCardDto);
  }

  /**
   * Handles PATCH requests to /cards/:id.
   * Updates a card's content.
   * @param id The ID of the card to update.
   * @param updateCardDto The DTO with the updated data.
   * @returns The updated card document.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  /**
   * Handles DELETE requests to /cards/:id.
   * Deletes a card by its ID.
   * @param id The ID of the card to delete.
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardsService.delete(id);
  }
}
