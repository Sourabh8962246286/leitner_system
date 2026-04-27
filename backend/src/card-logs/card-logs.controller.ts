import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CardLogsService } from './card-logs.service';
import { UpdateCardLogDto } from './dto/update-card-log.dto';

@UseGuards(JwtAuthGuard)
@Controller('card-logs')
export class CardLogsController {
  constructor(private readonly cardLogsService: CardLogsService) {}

  @Get(':cardId')
  getCardLogs(@Param('cardId') cardId: string, @Request() req) {
    return this.cardLogsService.getLogsForCard(cardId, req.user.userId);
  }

  @Patch(':logId')
  updateLogTimeSpent(
    @Param('logId') logId: string,
    @Body() body: UpdateCardLogDto,
    @Request() req,
  ) {
    return this.cardLogsService.updateLogTimeSpent(logId, req.user.userId, body.timeSpent);
  }
}
