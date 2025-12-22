import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CardDocument } from '../cards/schemas/card.schema';
import { TagDocument } from '../tags/schemas/tag.schema';
export declare class SubjectsService {
    private subjectModel;
    private cardModel;
    private tagModel;
    constructor(subjectModel: Model<SubjectDocument>, cardModel: Model<CardDocument>, tagModel: Model<TagDocument>);
    create(createSubjectDto: CreateSubjectDto): Promise<Subject>;
    findAll(): Promise<Subject[]>;
    delete(id: string): Promise<{
        deleted: boolean;
        _id: string;
    }>;
}
