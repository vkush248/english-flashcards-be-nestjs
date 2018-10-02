import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';
import { CardsService } from '../services/cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post()
    async create(@Body() createCardDto: CreateCardDto) {
        this.cardService.create(createCardDto);
    }

    @Get()
    findAll(): Promise<Card[]> {
        return this.cardService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id): Promise<Card> {
        return this.cardService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id, @Body() card) {
        return this.cardService.update(id, card);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id) {
        const deleted = await this.cardService.deleteOne(id);
        return deleted;
    }
}
