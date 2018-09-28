import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCardDto } from '../dto/create-card.dto';
import { CardsService } from '../services/cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardService: CardsService) { }

    @Post()
    async create(@Body() createCardDto: CreateCardDto) {
        return 'This action adds a new card';
    }

    @Get()
    findAll() {
        return this.cardService.findAll();
    }

    @Get(':id')
    findOne(@Param('_id') id) {
        return `This action returns a #${id} card`;
    }

    @Put(':id')
    update(@Param('_id') id, @Body() updateCardDto) {
        return `This action updates ${id} card`;
    }

    @Delete(':id')
    PaymentRequestUpdateEvent(@Param('_id') id, @Body() updateCardDto) {
        return `This action removes ${id} card`;
    }
}
