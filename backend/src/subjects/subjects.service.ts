
import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  async create(
    createSubjectDto: CreateSubjectDto,
    userId: string,
  ): Promise<Subject> {
    const createdSubject = new this.subjectModel({ ...createSubjectDto, userId });
    try {
      return await createdSubject.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('You already have a subject with this name.');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Subject[]> {
    return this.subjectModel.find({ userId }).exec();
  }

  async delete(
    id: string,
    userId: string,
  ): Promise<{ deleted: boolean; _id: string }> {
    const subject = await this.subjectModel.findOne({ _id: id, userId }).exec();
    if (!subject) {
      throw new ForbiddenException('Subject not found or you do not have permission.');
    }

    // Check if any cards are using this subject
    const cardCount = await this.cardModel
      .countDocuments({ subjectId: id, userId })
      .exec();
    if (cardCount > 0) {
      throw new ConflictException(
        `Cannot delete subject with ID "${id}" because it is associated with ${cardCount} card(s).`,
      );
    }

    // Delete the subject
    const result = await this.subjectModel
      .deleteOne({ _id: id, userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Subject with ID "${id}" not found`);
    }

    // Delete all tags associated with this subject
    await this.tagModel.deleteMany({ subjectId: id, userId }).exec();

    return { deleted: true, _id: id };
  }
}
