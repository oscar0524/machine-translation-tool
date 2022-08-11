import { Database } from "./database";
import { ISentence } from "./interface/isentence";
import { ITranslate } from "./interface/itranslate";


export class Sentence extends Database implements ISentence {
    id: number;
    setion_id: number;
    sentence: ITranslate;
    created: Date;
    updated: Date;

    constructor(id: number, setion_id: number, sentence: ITranslate, created: Date, updated: Date) {
        super();
        this.id = id;
        this.setion_id = setion_id;
        this.sentence = sentence;
        this.created = created;
        this.updated = updated;
    }

    static async getUseSetionId(setion_id: number): Promise<Sentence> {
        const dbSentence = await this.sql.get(`
        SELECT * FROM sentences WHERE setion_id = ?;
        `, setion_id)
        return new Sentence(
            dbSentence.id,
            dbSentence.setion_id,
            { original: dbSentence.original, translation: dbSentence.translation },
            dbSentence.created,
            dbSentence.updated
        )
    }

    static async insert(setion_id: number, original: string) {
        const sentenceId = await this.sql.run(`
        INSERT INTO sentences (setion_id,original,created,updated)
        VALUES (?,?,?,?);
        `, [
            setion_id,
            original,
            new Date().toISOString(),
            new Date().toISOString()
        ])
    }

}