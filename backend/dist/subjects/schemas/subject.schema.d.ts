import * as mongoose from 'mongoose';
export type SubjectDocument = Subject & mongoose.Document;
export declare class Subject {
    name: string;
    userId: string;
}
export declare const SubjectSchema: mongoose.Schema<Subject, mongoose.Model<Subject, any, any, any, mongoose.Document<unknown, any, Subject, any, mongoose.DefaultSchemaOptions> & Subject & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, Subject>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Subject, mongoose.Document<unknown, {}, Subject, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Subject & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: mongoose.SchemaDefinitionProperty<string, Subject, mongoose.Document<unknown, {}, Subject, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Subject & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: mongoose.SchemaDefinitionProperty<string, Subject, mongoose.Document<unknown, {}, Subject, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Subject & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Subject>;
