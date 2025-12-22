import { BoxesService } from './boxes.service';
export declare class BoxesController {
    private readonly boxesService;
    constructor(boxesService: BoxesService);
    findAll(): Promise<import("./schemas/box.schema").BoxDocument[]>;
}
