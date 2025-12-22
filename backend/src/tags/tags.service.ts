import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';

/**
 * Service for managing tags.
 */
@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  /**
   * Creates a new tag.
   * @param name The name of the tag to create.
   * @returns The newly created tag document.
   */
  async create(name: string): Promise<Tag> {
    const newTag = new this.tagModel({ name });
    return newTag.save();
  }

  /**
   * Retrieves all tags from the database.
   * @returns A promise that resolves to an array of all tags.
   */
  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  /**
   * Deletes a tag by its ID.
   * @param id The ID of the tag to delete.
   */
  async delete(id: string): Promise<{ deleted: boolean; _id: string }> {
    const result = await this.tagModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return { deleted: true, _id: id };
  }
}