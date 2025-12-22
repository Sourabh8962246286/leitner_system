import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto): Promise<import("./schemas/tag.schema").Tag>;
    findAll(): Promise<import("./schemas/tag.schema").Tag[]>;
    delete(id: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
