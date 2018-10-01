export class CreateCardDto {
    readonly _id: string;
    readonly topic: string;
    readonly word: string;
    readonly example: string;
    readonly context: string;
    readonly img: string;
    readonly translation: string;
    readonly exampleTranslation: string;
    readonly contextTranslation: string;
}