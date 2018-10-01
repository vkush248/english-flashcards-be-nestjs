import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card } from '../interfaces/card.interface';
import { CreateCardDto } from '../dto/create-card.dto';

@Injectable()
export class CardsService {
    constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) { }

    async create(createCardDto: CreateCardDto): Promise<Card> {
        const createdCard = new this.cardModel(createCardDto);
        return await createdCard.save();
      }

    async findAll(): Promise<Card[]> {
        return await this.cardModel.find().exec();
    }

}