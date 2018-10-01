import { Body, Controller, Get, Post } from '@nestjs/common';
import { Card } from '../interfaces/card.interface';
import { CardsService } from '../services/cards.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card as CardInterface } from '../interfaces/card.interface';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post()
    async create(@Body() createCardDto: CreateCardDto) {
        this.cardService.create(createCardDto);
    }

    @Get()
    findAll(): Promise<CardInterface> {
        return this.cardService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('_id') id) {
    //     return `This action returns a #${id} card`;
    // }

    // @Put(':id')
    // update(@Param('_id') id, @Body() updateCardDto) {
    //     return `This action updates ${id} card`;
    // }

    // @Delete(':id')
    // PaymentRequestUpdateEvent(@Param('_id') id, @Body() updateCardDto) {
    //     return `This action removes ${id} card`;
    // }
}
