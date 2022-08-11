import { Database } from "./database";
import { IWriter } from "./interface/iwriter";

export class Writer extends Database implements IWriter {
    id: number;
    name: string;
    url: string;

    constructor(id: number, name: string, url: string) {
        super();
        this.id = id;
        this.name = name;
        this.url = url;
    }

    static async get(name: string, url: string): Promise<Writer | null> {
        const dbWriter = await this.sql.all(`
        SELECT * from writers WHERE name = ? AND url = ?;
        `, [name, url])
        if (dbWriter.length > 0) {
            const writer = dbWriter[0]
            return new Writer(
                writer.id,
                writer.name,
                writer.url
            )
        }
        return null
    }

    static async getUseWriterId(id: number): Promise<Writer | null> {
        const dbWriter = await this.sql.get(`
        SELECT * from writers WHERE id = ?;
        `, id)
        if (dbWriter) {
            const writer = dbWriter
            return new Writer(
                writer.id,
                writer.name,
                writer.url
            )
        }
        return null
    }

    static async insert(name: string, url: string): Promise<Writer> {
        const writerId = await this.sql.run(`
        INSERT INTO writers (name,url)
        VALUES (?,?)
        `, [name, url])

        return new Writer(
            writerId,
            name,
            url
        )
    }



}