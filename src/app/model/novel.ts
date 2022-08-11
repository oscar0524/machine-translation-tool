import { write } from "original-fs";
import { SqliteService } from "../services/sqlite.service";
import { SyosetuNovelParserService } from "../services/syosetu-novel-parser.service";
import { Database } from "./database";
import { INovel } from "./interface/inovel";
import { ITranslate } from "./interface/itranslate";
import { Writer } from "./writer";
import { Chapter } from "./chapter";
import { Setion } from "./setion";
import { ThisReceiver } from "@angular/compiler";
import { Sentence } from "./sentence";

export class Novel extends Database implements INovel {
    id: number;
    name: ITranslate;
    writer_id: number;
    url: string;

    writer?: Writer;
    chapters?: Chapter[];


    private static syosetuNovelParser: SyosetuNovelParserService = new SyosetuNovelParserService();


    constructor(id: number, name: ITranslate, writer_id: number, url: string) {
        super();
        this.id = id;
        this.name = name;
        this.writer_id = writer_id;
        this.url = url
    }

    static async get(url: string): Promise<Novel | null> {
        const dbNovel = await this.sql.get(`
        SELECT * FROM novels WHERE url = ?;
        `, url)
        if (dbNovel) {
            const data = dbNovel
            return new Novel(
                data.id,
                {
                    original: data.name,
                    translation: data.translation_name
                },
                data.writer_id,
                data.url
            )
        }
        return null
    }

    static async insert(novelName: string, writerId: number, url: string): Promise<Novel> {
        const novelId = await this.sql.run(`
        INSERT INTO novels (name,writer_id,url)
        VALUES (?,?,?)
        `, [novelName, writerId, url])
        return new Novel(
            novelId,
            {
                original: novelName
            },
            writerId,
            url
        )
    }

    async getWriter() {
        const writerResponse = await Writer.getUseWriterId(this.writer_id)
        if (writerResponse) {
            this.writer = writerResponse
        }
    }

    async getChapters() {
        const chapterResponse = await Chapter.getUseNovelId(this.id)
        if (chapterResponse) {
            this.chapters = chapterResponse
            for (let chapter of this.chapters) {
                // console.log(chapter)
                chapter.getSetions()
            }
        }
    }



}