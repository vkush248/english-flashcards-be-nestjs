import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'auth/auth.guard';
import { HttpExceptionFilter } from 'common/exception.filter';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';
import { CardsService } from '../services/cards.service';

@Controller('api/cards')
@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard)
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post('new')
    async create(@Body() createCardDto: CreateCardDto): Promise<Card | Error> {
        return this.cardService.create(createCardDto);
    }

    @Get()
    async findAll(): Promise<Card[] | Error> {
        return this.cardService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<Card | Error> {
        return this.cardService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id, @Body() card): Promise<Card | Error> {
        return this.cardService.update(id, card);
    }

    @Delete('delete/:id')
    async deleteOne(@Param('id') id): Promise<Card | Error> {
        return await this.cardService.deleteOne(id);
    }
}
