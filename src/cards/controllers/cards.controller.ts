import { Body, Controller, Delete, Get, Param, Post, Put, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { User } from 'auth/interfaces/user.interface';
import { from, Observable } from 'rxjs';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';
import { CardsService } from '../services/cards.service';

@Controller('api/cards')
@UseGuards(AuthGuard)
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post('new')
    create(@Body() createCardDto: CreateCardDto, @Session() session): Observable<Card | Error> {
        return from(this.cardService.create(createCardDto, session.username));
    }

    @Get()
    findAll(): Observable<Card[] | Error> {
        return from(this.cardService.findAll());
    }

    @Get(':username')
    getUsersCards(@Param() username): Observable<Card[] | Error> {
        return from(this.cardService.getUsersCards(username));
    }

    @Get('card/:id')
    findOne(@Param('id') id): Observable<Card | Error> {
        return from(this.cardService.findOne(id));
    }

    @Put('update/:id')
    update(@Param('id') id, @Body() card): Observable<Card | Error> {
        return from(this.cardService.update(id, card));
    }

    @Delete('delete/:id')
    deleteOne(@Param('id') id): Observable<Card | Error> {
        return from(this.cardService.deleteOne(id));
    }

    @Put('add/:id')
    addCardToUsers(@Param('id') id, @Session() session): Observable<User | Error> {
        return from(this.cardService.addCardToUsers(id, session.username));
    }

    @Put('remove/:id')
    deleteUsersCard(@Param('id') id, @Session() session): Observable<User | Error> {
        return from(this.cardService.deleteUsersCard(id, session.username));
    }
}
