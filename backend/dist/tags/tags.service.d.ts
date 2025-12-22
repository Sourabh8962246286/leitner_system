import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';
export declare class TagsService {
    private tagModel;
    constructor(tagModel: Model<TagDocument>);
    create(createTagDto: CreateTagDto, userId: string): Promise<Tag>;
    findAll(userId: string, subjectId?: string): Promise<Tag[]>;
    delete(id: string, userId: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
