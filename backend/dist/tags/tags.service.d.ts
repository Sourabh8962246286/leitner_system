import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';
export declare class TagsService {
    private tagModel;
    constructor(tagModel: Model<TagDocument>);
    create(createTagDto: CreateTagDto): Promise<Tag>;
    findAll(subjectId?: string): Promise<Tag[]>;
    delete(id: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
