
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BoxesService } from './boxes/boxes.service';
import { CardsService } from './cards/cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Box } from './boxes/schemas/box.schema';
import { Card } from './cards/schemas/card.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const boxModel = app.get(getModelToken(Box.name));
    const cardModel = app.get(getModelToken(Card.name));

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
