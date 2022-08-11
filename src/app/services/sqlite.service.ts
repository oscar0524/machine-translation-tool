import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { SyosetuNovelParserService } from '../services/syosetu-novel-parser.service';

import * as sqlite3 from 'sqlite3';
import { FunctionExpr } from '@angular/compiler';

const TableName = [
  'novels',
  'writers',
  'chapters',
  'setions',
  'sentences',
  'comparison',
  'history'
];

const NovelsColumnName = [
  'id',
  'name',
  'translation_name',
  'writer_id',
  'url'
];

const WritersColumnName = [
  'id',
  'name',
  'url'
];

const ChaptersColumnName = [
  'id',
  'title',
  'translation_title',
  'novel_id',
];

const SetionsColumnName = [
  'id',
  'title',
  'translation_title',
  'chapter_id',
  'url',
  'upload',
  'created',
  'updated'
];

const SentencesColumnName = [
  'id',
  'setion_id',
  'original',
  'translation',
  'created',
  'updated'
];

const comparison = [
  'id',
  'original',
  'translation',
  'novel_id',
  'created',
  'updated'
];

const HistoryColumnName = [
  'id',
  'setion_id',
  'sentence_id',
  'created'
];

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private electronService: ElectronService = new ElectronService()
  constructor(

  ) { }

  private getDb() {
    let dbFilePath = './src/assets/database/database.db'
    if (this.electronService.fs.existsSync(this.electronService.path.join(__dirname, 'assets/database/database.db'))) {
      dbFilePath = this.electronService.path.join(__dirname, 'assets/database/database.db')
    }
    // console.log(dbFilePath)

    const sql = sqlite3.verbose();
    const db: sqlite3.Database = new sql.Database(dbFilePath, (err) => {
      if (err) {
        console.log(err)
      }
    });
    return db;
  }

  public run(query: string, params: any = []): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.serialize(() => {
        db.run(query, params, function (this, err) {
          if (err) {
            console.log(err)
            reject(null)
          }
          else {
            // console.log(this.changes, this.lastID)
            resolve(this.lastID)
          }
        })
      })
      db.close()
    });
  }

  public runAll(query: string, params: any[] = []): Promise<(number | null)[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.serialize(() => {
        let response: (number | null)[] = []
        const stmt = db.prepare(query);
        for (let param of params) {
          // console.log(param)
          stmt.run(param, function (this, err) {
            if (err) {
              console.log(err)
              response.push(null)
            }
            else {
              response.push(this.lastID)
            }
          });
        }
        stmt.finalize((err) => {
          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        });

      });
      db.close()
    });
  }

  public get(query: string, params: any = []): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.serialize(() => {
        db.get(query, params, (err, row) => {
          if (err) {
            console.log(err)
            reject(null)
          }
          else {
            resolve(row)
          }
        })
      })
      db.close()

    });
  }

  public all(query: string, params: any = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.serialize(() => {
        db.all(query, params, (err, rows) => {
          if (err) {
            console.log(err)
            reject([])
          }
          else {
            resolve(rows)
          }
        })
      })
      db.close()

    });
  }

  private async clearDb() {
    const tableList = await this.getTableList()
    for (let value of tableList) {
      console.log(`drop ${value.name}`)
      const response = await this.run(`DROP TABLE IF EXISTS ${value.name};`)
      // console.log('drop await res', response)
    }
    tableList.forEach(async (value: any) => {

    })
  }

  private async dbInit(): Promise<void> {
    await this.clearDb()
    const tableList = await this.getTableList()
    console.log('clear tablelist : ', tableList)
    if (tableList.length > 0) {
      console.log('dbInit fail')
      return
    }

    // novels
    await this.run(`
      CREATE TABLE novels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        translation_name TEXT,
        writer_id INTEGER NOT NULL,
        url TEXT NOT NULL
      );
      `);
    // writers
    await this.run(`
      CREATE TABLE writers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,      
        url TEXT NOT NULL
      );
      `);
    // chapters
    await this.run(`
      CREATE TABLE chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        translation_title TEXT,
        novel_id INTEGER NOT NULL
      );
      `);
    // setions
    await this.run(`
      CREATE TABLE setions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        translation_title TEXT,
        chapter_id INTEGER NOT NULL,
        url TEXT NOT NULL,
        upload TEXT,
        created TEXT NOT NULL,
        updated TEXT NOT NULL
      );
      `);
    // sentences
    await this.run(`
      CREATE TABLE sentences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setion_id INTEGER NOT NULL,
        original TEXT NOT NULL,
        translation TEXT,       
        created TEXT NOT NULL,
        updated TEXT NOT NULL
      );
      `);

    // comparison
    await this.run(`
    CREATE TABLE comparison (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original TEXT NOT NULL,
      translation TEXT,       
      novel_id INTEGER NOT NULL,
      created TEXT NOT NULL,
      updated TEXT NOT NULL
    );
    `);

    // history
    await this.run(`
      CREATE TABLE history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setion_id INTEGER NOT NULL,
        sentence_id INTEGER NOT NULL,
        created TEXT NOT NULL
      );
      `);


    const check = await this.checkDbIntegrity()
    if (check) {
      console.log('db init done!')
    }
    else {
      console.log('db init fail')
    }
  }



  private async getTableList(): Promise<any> {
    const query = `
    SELECT 
      name 
    FROM sqlite_schema 
    WHERE
      type ='table' AND 
      name NOT LIKE 'sqlite_%';`
    return await this.all(query)
  }

  private async getTableColumnPropertyList(tableName: string): Promise<any> {
    const query = `PRAGMA table_info(${tableName});`
    return await this.all(query)
  }

  private async checkDbIntegrity(): Promise<boolean> {
    const tableList = await this.getTableList()
    // console.log('getTableList result : ', tableList)
    let check = false;
    // console.log(tableList.length, TableName.length)
    if (tableList.length === TableName.length) {
      check = true
    }
    if (check) {
      tableList.forEach((value: { name: string }) => {
        if (check) {
          check = TableName.includes(value.name)
          // console.log(check, value)
        }
      })
    }

    // console.log(await this.getTableColumnPropertyList('novels'))
    return check;
  }

  async init() {
    this.dbInit() //debug
    const check = await this.checkDbIntegrity()
    // console.log(check)
    if (check === false) {
      console.log('db init!')
      this.dbInit()
    }
  }

}
