import { Title } from "@angular/platform-browser";
import { Database } from "./database";
import { ISetion } from "./interface/isetion";
import { ITranslate } from "./interface/itranslate";

export class Setion extends Database implements ISetion {
    id: number;
    title: ITranslate;
    chapter_id: number;
    url: string;
    upload?: Date | undefined;
    created: Date;
    updated: Date;

    constructor(id: number, title: ITranslate, chapter_id: number, url: string, created: Date, updated: Date, upload?: Date) {
        super()
        this.id = id;
        this.title = title;
        this.chapter_id = chapter_id;
        this.url = url;
        this.created = created;
        this.updated = updated;
        this.upload = upload;
        this.upload = upload;
    }

    static async getUseId(id: number): Promise<Setion> {
        const dbSetion = await this.sql.get(`
        SELECT * FROM setions WHERE id = ?;`, id);
        return new Setion(
            dbSetion.id,
            {
                original: dbSetion.title,
                translation: dbSetion.translation_title
            },
            dbSetion.chapter_id,
            dbSetion.url,
            dbSetion.created,
            dbSetion.updated
        )
    }

    static async getUseUrl(url: string): Promise<Setion> {
        const dbSetion = await this.sql.get(`
        SELECT * FROM setions WHERE url = ?;`, url);
        return new Setion(
            dbSetion.id,
            {
                original: dbSetion.title,
                translation: dbSetion.translation_title
            },
            dbSetion.chapter_id,
            dbSetion.url,
            dbSetion.created,
            dbSetion.updated
        )
    }

    static async getUseChapterId(chapterId: number): Promise<Setion[]> {
        const dbSetion = await this.sql.all(`
        SELECT * FROM setions WHERE chapter_id = ?;`, chapterId);
        const response: Setion[] = [];
        for (let setion of dbSetion) {
            response.push(new Setion(
                setion.id,
                {
                    original: setion.title,
                    translation: setion.translation_title
                },
                setion.chapter_id,
                setion.url,
                setion.created,
                setion.updated
            ))
        }
        return response
    }

    static async insert(title: string, chapter_id: number, url: string): Promise<number | null> {
        const sentenceId = await this.sql.run(`
        INSERT INTO setions (title,chapter_id,url,created,updated)
        VALUES (?,?,?,?,?);
        `, [
            title,
            chapter_id,
            url,
            new Date().toISOString(),
            new Date().toISOString()
        ])
        return sentenceId
    }

    static async insertAll(data: { title: string, chapter_id: number, url: string }[]): Promise<Setion[]> {
        const inputData = [];
        const date = new Date()
        const dateString = date.toISOString()
        for (let item of data) {
            inputData.push([item.title, item.chapter_id, item.url, dateString, dateString])
        }
        const sentenceIds = await this.sql.runAll(`
        INSERT INTO setions (title,chapter_id,url,created,updated)
        VALUES (?,?,?,?,?);
        `, inputData)
        const responseData = []
        for (let index = 0; index < sentenceIds.length; index++) {
            let sentenceId = sentenceIds[index]
            if (sentenceId)
                responseData.push(new Setion(
                    sentenceId,
                    { original: data[index].title },
                    data[index].chapter_id,
                    data[index].url,
                    date,
                    date
                ))
        }
        return responseData
    }
}