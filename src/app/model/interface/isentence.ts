import { ITranslate } from "./itranslate";

export interface ISentence {
    id: number;
    setion_id: number;
    sentence: ITranslate;
    created: Date;
    updated: Date;
}