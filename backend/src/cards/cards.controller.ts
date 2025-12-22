
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller for handling HTTP requests related to cards.
 */
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Handles POST requests to /cards.
   * Creates a new card for the authenticated user.
   */
  @Post()
  create(@Body(new ValidationPipe()) createCardDto: CreateCardDto, @Request() req) {
    return this.cardsService.create(createCardDto, req.user.userId);
  }

  /**
   * Handles GET requests to /cards.
   * Returns a list of cards for the authenticated user, optionally filtered.
   */
  @Get()
  findAll(
    @Query('tags') tags: string,
    @Query('subjectId') subjectId: string,
    @Request() req,
  ) {
    const tagIds = tags ? tags.split(',') : [];
    return this.cardsService.findAll(req.user.userId, tagIds, subjectId);
  }

  /**
   * Handles POST requests to /cards/review.
   * Handles a review for a card owned by the authenticated user.
   */
  @Post('review')
  handleReview(
    @Body(new ValidationPipe()) reviewCardDto: ReviewCardDto,
    @Request() req,
  ) {
    return this.cardsService.handleReview(reviewCardDto, req.user.userId);
  }

  /**
   * Handles PATCH requests to /cards/:id.
   * Updates a card owned by the authenticated user.
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateCardDto: UpdateCardDto,
    @Request() req,
  ) {
    return this.cardsService.update(id, updateCardDto, req.user.userId);
  }

  /**
   * Handles DELETE requests to /cards/:id.
   * Deletes a card owned by the authenticated user.
   */
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.cardsService.delete(id, req.user.userId);
  }
}
