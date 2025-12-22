import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Box, BoxDocument } from './schemas/box.schema';

/**
 * Service for interacting with the 'boxes' collection in the database.
 * Provides methods for retrieving box data.
 */
@Injectable()
export class BoxesService {
  constructor(@InjectModel(Box.name) private boxModel: Model<BoxDocument>) {}

  /**
   * Retrieves all boxes from the database, sorted by level.
   * @returns A promise that resolves to an array of all boxes.
   */
  async findAll(): Promise<BoxDocument[]> {
    return this.boxModel.find().sort({ level: 'asc' }).exec();
  }

  /**
   * Finds a single box by its level.
   * @param level The level of the box to find.
   * @returns A promise that resolves to the box, or null if not found.
   */
  async findByLevel(level: number): Promise<BoxDocument | null> {
    return this.boxModel.findOne({ level }).exec();
  }
}