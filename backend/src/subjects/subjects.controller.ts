
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './schemas/subject.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Request() req,
  ): Promise<Subject> {
    return this.subjectsService.create(createSubjectDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req): Promise<Subject[]> {
    return this.subjectsService.findAll(req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.subjectsService.delete(id, req.user.userId);
  }
}
