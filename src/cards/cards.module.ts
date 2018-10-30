import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { CardsController } from './controllers/cards.controller';
import { CardSchema } from './schema/card.schema';
import { CardsService } from './services/cards.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Card', schema: CardSchema }]),
        AuthModule,
    ],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule { }
