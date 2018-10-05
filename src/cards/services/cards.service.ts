import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../interfaces/card.interface';

@Injectable()
export class CardsService {
    constructor(@InjectModel('Card') private readonly cardModel: Model<Card>) { }

    async create(createCardDto: CreateCardDto): Promise<any> {
        const createdCard = new this.cardModel(createCardDto);
        return await createdCard.save();
    }

    async findAll(): Promise<Card[]> {
        return await this.cardModel.find().exec();
    }

    async findOne(id): Promise<Card> {
        return await this.cardModel.findById(id).exec();
    }

    async update(id: string, card: CreateCardDto): Promise<Card> {
        return await this.cardModel.findByIdAndUpdate(id, card);
    }

    async deleteOne(id: string): Promise<Card> {
        return await this.cardModel.findByIdAndDelete(id);
    }
}
