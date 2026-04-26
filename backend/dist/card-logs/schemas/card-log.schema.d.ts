import * as mongoose from 'mongoose';
export type CardLogDocument = CardLog & mongoose.Document;
export declare class CardLog {
    cardId: string;
    userId: string;
    subjectId: string;
    isCorrect: boolean;
    timeSpent: number;
    previousBoxLevel: number;
    newBoxLevel: number;
    reviewedAt: Date;
}
export declare const CardLogSchema: mongoose.Schema<CardLog, mongoose.Model<CardLog, any, any, any, mongoose.Document<unknown, any, CardLog, any, mongoose.DefaultSchemaOptions> & CardLog & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any, CardLog>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, CardLog, mongoose.Document<unknown, {}, CardLog, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    cardId?: mongoose.SchemaDefinitionProperty<string, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: mongoose.SchemaDefinitionProperty<string, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subjectId?: mongoose.SchemaDefinitionProperty<string, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isCorrect?: mongoose.SchemaDefinitionProperty<boolean, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timeSpent?: mongoose.SchemaDefinitionProperty<number, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousBoxLevel?: mongoose.SchemaDefinitionProperty<number, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    newBoxLevel?: mongoose.SchemaDefinitionProperty<number, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewedAt?: mongoose.SchemaDefinitionProperty<Date, CardLog, mongoose.Document<unknown, {}, CardLog, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<CardLog & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CardLog>;
