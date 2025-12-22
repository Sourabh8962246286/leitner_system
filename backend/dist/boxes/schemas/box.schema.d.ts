import { Document } from 'mongoose';
export type BoxDocument = Box & Document;
export declare class Box {
    title: string;
    schedule: string[];
    level: number;
}
export declare const BoxSchema: import("mongoose").Schema<Box, import("mongoose").Model<Box, any, any, any, Document<unknown, any, Box, any, import("mongoose").DefaultSchemaOptions> & Box & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Box>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Box, Document<unknown, {}, Box, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Box & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Box, Document<unknown, {}, Box, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Box & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    schedule?: import("mongoose").SchemaDefinitionProperty<string[], Box, Document<unknown, {}, Box, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Box & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    level?: import("mongoose").SchemaDefinitionProperty<number, Box, Document<unknown, {}, Box, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Box & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Box>;
