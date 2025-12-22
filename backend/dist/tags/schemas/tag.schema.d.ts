import { Document, Schema as MongooseSchema } from 'mongoose';
export type TagDocument = Tag & Document;
export declare class Tag {
    name: string;
    subjectId: string;
}
export declare const TagSchema: MongooseSchema<Tag, import("mongoose").Model<Tag, any, any, any, Document<unknown, any, Tag, any, import("mongoose").DefaultSchemaOptions> & Tag & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Tag>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tag, Document<unknown, {}, Tag, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tag & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Tag, Document<unknown, {}, Tag, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tag & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjectId?: import("mongoose").SchemaDefinitionProperty<string, Tag, Document<unknown, {}, Tag, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Tag & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Tag>;
