import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
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
   * Creates a new tag under a specific subject for a user.
   * Checks for duplicates within the same subject for that user.
   * @param createTagDto The DTO containing the tag's name and subjectId.
   * @param userId The ID of the authenticated user.
   * @returns The newly created tag document.
   */
  async create(createTagDto: CreateTagDto, userId: string): Promise<Tag> {
    const { name, subjectId } = createTagDto;
    const newTag = new this.tagModel({ ...createTagDto, userId });
    try {
      return await newTag.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Tag "${name}" already exists for this subject.`,
        );
      }
      throw error;
    }
  }

  /**
   * Retrieves all tags for a user, optionally filtered by subject.
   * @param userId The ID of the user.
   * @param subjectId The ID of the subject to filter tags by.
   * @returns A promise that resolves to an array of tags.
   */
  async findAll(userId: string, subjectId?: string): Promise<Tag[]> {
    const filter: { userId: string; subjectId?: string } = { userId };
    if (subjectId) {
      filter.subjectId = subjectId;
    }
    return this.tagModel.find(filter).exec();
  }

  /**
   * Deletes a tag by its ID, ensuring it belongs to the user.
   * @param id The ID of the tag to delete.
   * @param userId The ID of the user requesting the deletion.
   */
  async delete(
    id: string,
    userId: string,
  ): Promise<{ deleted: boolean; _id: string }> {
    const tag = await this.tagModel.findOne({ _id: id, userId }).exec();
    if (!tag) {
      throw new ForbiddenException('Tag not found or you do not have permission.');
    }

    // TODO: Also remove this tag from all cards that use it.
    // This is a more advanced feature for later.
    const result = await this.tagModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return { deleted: true, _id: id };
  }
}