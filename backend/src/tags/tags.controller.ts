import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createTagDto: CreateTagDto,
    @Request() req,
  ) {
    return this.tagsService.create(createTagDto, req.user.userId);
  }

  @Get()
  findAll(@Query('subjectId') subjectId: string, @Request() req) {
    return this.tagsService.findAll(req.user.userId, subjectId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    // TODO: Also remove this tag from all cards that have it.
    // This is a more advanced topic for later.
    return this.tagsService.delete(id, req.user.userId);
  }
}