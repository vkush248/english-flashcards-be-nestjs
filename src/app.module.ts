import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { CardsService } from './cards/services/cards.service';

@Module({
  imports: [
    CardsModule,
    MongooseModule.forRoot('mongodb://localhost/flashcards'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
