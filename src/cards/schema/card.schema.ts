import * as mongoose from 'mongoose';

export const CardSchema = new mongoose.Schema({
    topic: String,
    word: String,
    example: String,
    context: String,
    img: String,
    translation: String,
    exampleTranslation: String,
    contextTranslation: String,
});
