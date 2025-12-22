import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';

/**
 * Service for managing tags.
 */
@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  /**
   * Creates a new tag under a specific subject.
   * Checks for duplicates within the same subject.
   * @param createTagDto The DTO containing the tag's name and subjectId.
   * @returns The newly created tag document.
   */
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name, subjectId } = createTagDto;
    // Check if a tag with the same name already exists for the given subject
    const existingTag = await this.tagModel.findOne({ name, subjectId }).exec();
    if (existingTag) {
      throw new ConflictException(
        `Tag "${name}" already exists for this subject.`,
      );
    }
    const newTag = new this.tagModel(createTagDto);
    return newTag.save();
  }

  /**
   * Retrieves all tags from the database, optionally filtered by subject.
   * @param subjectId The ID of the subject to filter tags by.
   * @returns A promise that resolves to an array of tags.
   */
  async findAll(subjectId?: string): Promise<Tag[]> {
    const filter = subjectId ? { subjectId } : {};
    return this.tagModel.find(filter).exec();
  }

  /**
   * Deletes a tag by its ID.
   * @param id The ID of the tag to delete.
   */
  async delete(id: string): Promise<{ deleted: boolean; _id: string }> {
    // TODO: Also remove this tag from all cards that use it.
    // This is a more advanced feature for later.
    const result = await this.tagModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return { deleted: true, _id: id };
  }
}