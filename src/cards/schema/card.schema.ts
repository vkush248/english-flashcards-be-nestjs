import * as mongoose from 'mongoose';

export const CardSchema = new mongoose.Schema({
    _id: String,
    topic: String,
    word: String,
    example: String,
    context: String,
    img: String,
    translation: String,
    exampleTranslation: String,
    contextTranslation: String,
});

