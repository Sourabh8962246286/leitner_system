import { Controller, Get } from '@nestjs/common';
import { BoxesService } from './boxes.service';

/**
 * Controller for handling HTTP requests related to boxes.
 */
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  /**
   * Handles GET requests to /boxes.
   * Returns a list of all boxes and their schedules.
   */
  @Get()
  findAll() {
    return this.boxesService.findAll();
  }
}