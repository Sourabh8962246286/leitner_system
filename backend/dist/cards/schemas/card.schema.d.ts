import * as mongoose from 'mongoose';
import { Box } from '../../boxes/schemas/box.schema';
import { Tag } from '../../tags/schemas/tag.schema';
import { Subject } from '../../subjects/schemas/subject.schema';
export type CardDocument = Card & mongoose.Document;
export declare class Card {
    front: string;
    back: string;
    currentBoxId: Box;
    subjectId: Subject;
    lastReviewed: Date;
    tags: Tag[];
    color: string;
}
export declare const CardSchema: mongoose.Schema<Card, mongoose.Model<Card, any, any, any, mongoose.Document<unknown, any, Card, any, mongoose.DefaultSchemaOptions> & Card & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, Card>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Card, mongoose.Document<unknown, {}, Card, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    front?: mongoose.SchemaDefinitionProperty<string, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    back?: mongoose.SchemaDefinitionProperty<string, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentBoxId?: mongoose.SchemaDefinitionProperty<Box, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjectId?: mongoose.SchemaDefinitionProperty<Subject, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastReviewed?: mongoose.SchemaDefinitionProperty<Date, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: mongoose.SchemaDefinitionProperty<Tag[], Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    color?: mongoose.SchemaDefinitionProperty<string, Card, mongoose.Document<unknown, {}, Card, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<Card & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Card>;
