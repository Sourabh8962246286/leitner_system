import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CardLogsService } from './card-logs.service';

@UseGuards(JwtAuthGuard)
@Controller('card-logs')
export class CardLogsController {
  constructor(private readonly cardLogsService: CardLogsService) {}

  @Get(':cardId')
  getCardLogs(@Param('cardId') cardId: string, @Request() req) {
    return this.cardLogsService.getLogsForCard(cardId, req.user.userId);
  }
}
