"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const box_schema_1 = require("./boxes/schemas/box.schema");
const card_schema_1 = require("./cards/schemas/card.schema");
const subject_schema_1 = require("./subjects/schemas/subject.schema");
const tag_schema_1 = require("./tags/schemas/tag.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const boxModel = app.get((0, mongoose_1.getModelToken)(box_schema_1.Box.name));
    const cardModel = app.get((0, mongoose_1.getModelToken)(card_schema_1.Card.name));
    const subjectModel = app.get((0, mongoose_1.getModelToken)(subject_schema_1.Subject.name));
    const tagModel = app.get((0, mongoose_1.getModelToken)(tag_schema_1.Tag.name));
    console.log('Seeding database...');
    await boxModel.deleteMany({});
    await cardModel.deleteMany({});
    await subjectModel.deleteMany({});
    await tagModel.deleteMany({});
    const subject1 = await new subjectModel({ name: 'General Knowledge' }).save();
    const box1 = await new boxModel({ title: 'Box 1', schedule: ['Everyday'], level: 1 }).save();
    await new boxModel({ title: 'Box 2', schedule: ['Tuesday', 'Thursday'], level: 2 }).save();
    await new boxModel({ title: 'Box 3', schedule: ['Saturday'], level: 3 }).save();
    await new boxModel({ title: 'Box 4', schedule: ['Every other Saturday'], level: 4 }).save();
    await new boxModel({ title: 'Box 5', schedule: ['First Sunday of the month'], level: 5 }).save();
    await new cardModel({
        front: 'What is NestJS?',
        back: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
        currentBoxId: box1._id,
        subjectId: subject1._id,
    }).save();
    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map