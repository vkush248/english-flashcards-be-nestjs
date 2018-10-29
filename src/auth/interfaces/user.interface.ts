import { Card } from 'cards/interfaces/card.interface';
import { Document } from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    cards: Card[];
    hash?: string;
    refreshToken?: string;
}