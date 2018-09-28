import { Injectable } from '@nestjs/common';
import { Card } from '../interfaces/card.interface';

@Injectable()
export class CardsService {
    private readonly cards: Card[] = [];

    create(card: Card) {
        this.cards.push(card);
    }

    findAll(): Card[] {
        return this.cards;
    }
}