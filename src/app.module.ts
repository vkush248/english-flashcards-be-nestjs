import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'auth/auth.module';
import { AppController } from './app.controller';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    CardsModule,
    MongooseModule.forRoot('mongodb://localhost/flashcards'),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
