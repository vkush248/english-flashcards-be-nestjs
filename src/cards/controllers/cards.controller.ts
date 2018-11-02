import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { session } from 'express-session';
import { from, Observable } from 'rxjs';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';
import { CardsService } from '../services/cards.service';

@Controller('api/cards')
@UseGuards(AuthGuard)
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post('new')
    create(@Body() createCardDto: CreateCardDto): Observable<Card | Error> {
        console.log(session);
        return from(this.cardService.create(createCardDto));
    }

    @Get()
    findAll(): Observable<Card[] | Error> {
        return from(this.cardService.findAll());
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
    deleteOne(@Param('id') id): Observable<Card | Error> {
        return from(this.cardService.deleteOne(id));
    }
}
