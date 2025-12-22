import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll(@Query('subjectId') subjectId?: string) {
    return this.tagsService.findAll(subjectId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    // TODO: Also remove this tag from all cards that have it.
    // This is a more advanced topic for later.
    return this.tagsService.delete(id);
  }
}