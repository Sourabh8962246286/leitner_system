"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const box_schema_1 = require("./boxes/schemas/box.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const boxModel = app.get((0, mongoose_1.getModelToken)(box_schema_1.Box.name));
    console.log('Seeding database with default boxes...');
    await boxModel.deleteMany({});
    await new boxModel({ title: 'Box 1', schedule: ['Everyday'], level: 1 }).save();
    await new boxModel({ title: 'Box 2', schedule: ['Tuesday', 'Thursday'], level: 2 }).save();
    await new boxModel({ title: 'Box 3', schedule: ['Saturday'], level: 3 }).save();
    await new boxModel({ title: 'Box 4', schedule: ['Every other Saturday'], level: 4 }).save();
    await new boxModel({ title: 'Box 5', schedule: ['First Sunday of the month'], level: 5 }).save();
    console.log('Seeding complete!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map