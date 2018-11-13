import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { UsersService } from 'auth/services/users.service';
import { Model } from 'mongoose';
import { from, Observable } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('Card') private readonly cardModel: Model<Card>,
        private readonly usersService: UsersService,
    ) { }

    create(createCardDto: CreateCardDto, session): Observable<any> {
        const createdCard = new this.cardModel(createCardDto);
        return from(createdCard.save()).pipe(
            pluck('_id'),
            switchMap(id => this.usersService.updateUser(session.username, { $push: { cards: id } })),
        );
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

    findUsersCards(session): Observable<Card[]> {
        return from(this.usersService.getUserByUsername(session.username)).pipe(
            pluck('cards'),
            switchMap(cardsIds => from(this.cardModel.find({ _id: { $in: cardsIds } }).exec())),
        );
    }

    deleteUsersCard(id: string, username): Observable<User> {
        return this.usersService.updateUser(username, { $pull: { cards: { $in: [id] } } });
    }

}
