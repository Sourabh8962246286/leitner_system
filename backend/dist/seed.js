"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const box_schema_1 = require("./boxes/schemas/box.schema");
const card_schema_1 = require("./cards/schemas/card.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const boxModel = app.get((0, mongoose_1.getModelToken)(box_schema_1.Box.name));
    const cardModel = app.get((0, mongoose_1.getModelToken)(card_schema_1.Card.name));
    console.log('Seeding database...');
    await boxModel.deleteMany({});
    await cardModel.deleteMany({});
    const box1 = await new boxModel({ title: 'Box 1', schedule: ['Everyday'], level: 1 }).save();
    const box2 = await new boxModel({ title: 'Box 2', schedule: ['Tuesday', 'Thursday'], level: 2 }).save();
    const box3 = await new boxModel({ title: 'Box 3', schedule: ['Sunday'], level: 3 }).save();
    await new cardModel({
        front: 'What is NestJS?',
        back: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
        currentBoxId: box1._id,
    }).save();
    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map