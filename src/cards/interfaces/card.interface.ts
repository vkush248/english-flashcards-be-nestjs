import { Document } from 'mongoose';

export interface Card extends Document {
    readonly topic: string;
    readonly word: string;
    readonly example: string;
    readonly context: string;
    readonly img: string;
    readonly translation: string;
    readonly exampleTranslation: string;
    readonly contextTranslation: string;
}