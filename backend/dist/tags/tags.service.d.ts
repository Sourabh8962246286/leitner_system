import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
export declare class TagsService {
    private tagModel;
    constructor(tagModel: Model<TagDocument>);
    create(name: string): Promise<Tag>;
    findAll(): Promise<Tag[]>;
    delete(id: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
