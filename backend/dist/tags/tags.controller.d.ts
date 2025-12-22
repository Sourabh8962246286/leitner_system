import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto, req: any): Promise<import("./schemas/tag.schema").Tag>;
    findAll(subjectId: string, req: any): Promise<import("./schemas/tag.schema").Tag[]>;
    delete(id: string, req: any): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
