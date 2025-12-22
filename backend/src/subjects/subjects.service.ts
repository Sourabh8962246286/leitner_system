
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Card, CardDocument } from '../cards/schemas/card.schema';
import { Tag, TagDocument } from '../tags/schemas/tag.schema';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const createdSubject = new this.subjectModel(createSubjectDto);
    return createdSubject.save();
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }

  async delete(id: string): Promise<{ deleted: boolean; _id: string }> {
    // Check if any cards are using this subject
    const cardCount = await this.cardModel.countDocuments({ subjectId: id }).exec();
    if (cardCount > 0) {
      throw new ConflictException(
        `Cannot delete subject with ID "${id}" because it is associated with ${cardCount} card(s).`,
      );
    }

    // Delete the subject
    const result = await this.subjectModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Subject with ID "${id}" not found`);
    }

    // Delete all tags associated with this subject
    await this.tagModel.deleteMany({ subjectId: id }).exec();

    return { deleted: true, _id: id };
  }
}
