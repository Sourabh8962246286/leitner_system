
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Box } from './boxes/schemas/box.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const boxModel = app.get(getModelToken(Box.name));

    console.log('Seeding database with default boxes...');

    // Clear existing boxes to ensure a clean slate
    await boxModel.deleteMany({});

    // Create boxes
    await new boxModel({ title: 'Box 1', schedule: ['Everyday'], level: 1 }).save();
    await new boxModel({ title: 'Box 2', schedule: ['Tuesday', 'Thursday'], level: 2 }).save();
    await new boxModel({ title: 'Box 3', schedule: ['Saturday'], level: 3 }).save();
    await new boxModel({ title: 'Box 4', schedule: ['Every other Saturday'], level: 4 }).save();
    await new boxModel({ title: 'Box 5', schedule: ['First Sunday of the month'], level: 5 }).save();

    console.log('Seeding complete!');
    await app.close();
}

bootstrap();
