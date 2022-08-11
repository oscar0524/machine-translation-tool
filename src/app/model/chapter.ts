import { Database } from "./database";
import { IChapter } from "./interface/ichapter";
import { ITranslate } from "./interface/itranslate";
import { Setion } from "./setion";

export class Chapter extends Database implements IChapter {
    id: number;
    title: ITranslate;
    novel_id: number;

    setions?: Setion[];

    constructor(id: number, title: ITranslate, novel_id: number) {
        super();
        this.id = id;
        this.title = title;
        this.novel_id = novel_id;
    }

    static async getUseId(id: number): Promise<Chapter | null> {
        const dbChapter = await this.sql.get(`
            SELECT * FROM chapters WHERE id = ?;
            `, id)
        if (dbChapter) {
            return new Chapter(
                dbChapter.id,
                { original: dbChapter.title, translation: dbChapter.translation },
                dbChapter.novel_id
            )
        } else {
            return null
        }

    }

    static async getUseNovelId(novel_id: number): Promise<Chapter[]> {
        const dbChapter = await this.sql.all(`
            SELECT * FROM chapters WHERE novel_id = ?;
            `, novel_id)
        const response: Chapter[] = []
        for (let chapter of dbChapter) {
            response.push(new Chapter(
                chapter.id,
                {
                    original: chapter.title,
                    translation: chapter.translation_title
                },
                chapter.novel_id
            ))
        }
        return response
    }

    static async insert(title: string, novel_id: number): Promise<Chapter | null> {
        const chapterId = await this.sql.run(`
        INSERT INTO chapters (title,novel_id)
        VALUES (?,?)
        `, [title, novel_id])
        if (chapterId) {
            return new Chapter(
                chapterId,
                { original: title },
                novel_id
            )
        } else {
            return null;
        }
    }

    async getSetions() {
        const setionResponse = await Setion.getUseChapterId(this.id)
        if (setionResponse) {
            this.setions = setionResponse
        }
    }

}