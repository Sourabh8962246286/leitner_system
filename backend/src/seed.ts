
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Box } from './boxes/schemas/box.schema';
import { Card } from './cards/schemas/card.schema';
import { Subject } from './subjects/schemas/subject.schema';
import { Tag } from './tags/schemas/tag.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const boxModel = app.get(getModelToken(Box.name));
    const cardModel = app.get(getModelToken(Card.name));
    const subjectModel = app.get(getModelToken(Subject.name));
    const tagModel = app.get(getModelToken(Tag.name));

    console.log('Seeding database...');

    await boxModel.deleteMany({});
    await cardModel.deleteMany({});
    await subjectModel.deleteMany({});
    await tagModel.deleteMany({});

    // Create a sample subject
    const subject1 = await new subjectModel({ name: 'General Knowledge' }).save();

    // Create boxes
    const box1 = await new boxModel({ title: 'Box 1', schedule: ['Everyday'], level: 1 }).save();
    await new boxModel({ title: 'Box 2', schedule: ['Tuesday', 'Thursday'], level: 2 }).save();
    await new boxModel({ title: 'Box 3', schedule: ['Saturday'], level: 3 }).save();
    await new boxModel({ title: 'Box 4', schedule: ['Every other Saturday'], level: 4 }).save();
    await new boxModel({ title: 'Box 5', schedule: ['First Sunday of the month'], level: 5 }).save();

    // Create a sample card associated with the subject
    await new cardModel({
        front: 'What is NestJS?',
        back: 'A progressive Node.js framework for building efficient, reliable and scalable server-side applications.',
        currentBoxId: box1._id,
        subjectId: subject1._id, // Associate with the created subject
    }).save();

    console.log('Seeding complete!');
    await app.close();
}

bootstrap();
