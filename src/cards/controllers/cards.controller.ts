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
        return from(this.cardService.create(createCardDto, session));
    }

    /*     @Get()
        findAll(): Observable<Card[] | Error> {
            return from(this.cardService.findAll());
        } */

    @Get()
    findAll(@Session() session): Observable<Card[] | Error> {
        return from(this.cardService.findUsersCards(session));
    }

    @Get(':user')
    findUsers(@Session() session): Observable<Card[] | Error> {
        return from(this.cardService.findUsersCards(session));
    }

    @Get(':id')
    findOne(@Param('id') id): Observable<Card | Error> {
        return from(this.cardService.findOne(id));
    }

    @Put('update/:id')
    update(@Param('id') id, @Body() card): Observable<Card | Error> {
        return from(this.cardService.update(id, card));
    }

    @Delete('delete/:id')
    deleteOne(@Param('id') id, @Session() session): Observable<User> {
        return from(this.cardService.deleteUsersCard(id, session));
    }

    @Delete('delete/:user/:id')
    deleteUsersCard(@Param('id') id, @Session() session): Observable<User> {
        return from(this.cardService.deleteUsersCard(id, session));
    }
}
