import { Model } from 'mongoose';
import { BoxDocument } from './schemas/box.schema';
export declare class BoxesService {
    private boxModel;
    constructor(boxModel: Model<BoxDocument>);
    findAll(): Promise<BoxDocument[]>;
    findByLevel(level: number): Promise<BoxDocument | null>;
}
