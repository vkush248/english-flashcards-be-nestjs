import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'auth/services/users.service';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('Card') private readonly cardModel: Model<Card>,
        private readonly usersService: UsersService,
    ) { }

    create(createCardDto: CreateCardDto): Observable<any> {
        const createdCard = new this.cardModel(createCardDto);
        return from(createdCard.save());
    }

    findAll(): Observable<Card[]> {
        return from(this.cardModel.find().exec());
    }

    findOne(id): Observable<Card> {
        return from(this.cardModel.findById(id).exec());
    }

    update(id: string, card: CreateCardDto): Observable<Card> {
        return from(this.cardModel.findByIdAndUpdate(id, card).exec());
    }

    deleteOne(id: string): Observable<Card> {
        return from(this.cardModel.findByIdAndDelete(id).exec());
    }
}
