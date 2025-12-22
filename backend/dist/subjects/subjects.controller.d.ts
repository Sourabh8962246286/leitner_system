import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from './schemas/subject.schema';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(createSubjectDto: CreateSubjectDto, req: any): Promise<Subject>;
    findAll(req: any): Promise<Subject[]>;
    delete(id: string, req: any): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
