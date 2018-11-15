import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'auth/interfaces/user.interface';
import { UsersService } from 'auth/services/users.service';
import { Model } from 'mongoose';
import { from, Observable, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';

@Injectable()
export class CardsService {
    constructor(
        @InjectModel('Card') private readonly cardModel: Model<Card>,
        private readonly usersService: UsersService,
    ) { }

    create(createCardDto: CreateCardDto, username): Observable<any> {
        const createdCard = new this.cardModel(createCardDto);
        return from(createdCard.save()).pipe(
            pluck('_id'),
            switchMap(id => this.addCardToUsers(id, username)),
        );
    }

    findAll(): Observable<any> {
        return of(this.cardModel.find().lean());
    }

    findOne(id): Observable<any> {
        return of(this.cardModel.findById(id).lean());
    }

    findMany(condition): Observable<any> {
        return of(this.cardModel.find(condition).lean());
    }

    update(id: string, card: CreateCardDto): Observable<any> {
        return of(this.cardModel.findByIdAndUpdate(id, card).lean());
    }

    deleteOne(id: string): Observable<any> {
        return of(this.cardModel.findByIdAndDelete(id).lean());
    }

    getUsersCards(session): Observable<Card[]> {
        return from(this.usersService.getUserByUsername(session.username)).pipe(
            pluck('cards'),
            switchMap(cardsIds => this.findMany({ _id: { $in: cardsIds } })),
        );
    }

    addCardToUsers(id, username) {
        return this.usersService.updateUser(username, { $push: { cards: id } });
    }

    deleteUsersCard(id: string, username): Observable<User> {
        return this.usersService.updateUser(username, { $pull: { cards: { $in: [id] } } });
    }

}
