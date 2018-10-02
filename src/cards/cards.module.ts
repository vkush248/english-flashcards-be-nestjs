import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsController } from './controllers/cards.controller';
import { CardSchema } from './schema/card.schema';
import { CardsService } from './services/cards.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
    ],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule { }
