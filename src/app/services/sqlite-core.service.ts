import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

import * as sqlite3 from 'sqlite3';

const TableName = [
  'novels',
  'writers',
  'episodes',
  'chapters',
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

const EpisodesColumnName = [
  'id',
  'name',
  'translation_name',
  'novel_id',
];

const ChaptersColumnName = [
  'id',
  'name',
  'translation_name',
  'episode_id',
  'url',
  'upload',
  'created',
  'updated'
];

const SentencesColumnName = [
  'id',
  'chapter_id',
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
  'chapter_id',
  'sentence_id',
  'created'
];

@Injectable({
  providedIn: 'root'
})
export class SqliteCoreService {

  constructor(
    private electronService: ElectronService
  ) { }

  private getDb() {
    let dbFilePath = './src/assets/database/database.db'
    if (this.electronService.fs.existsSync(this.electronService.path.join(__dirname, 'assets/database/database.db'))) {
      dbFilePath = this.electronService.path.join(__dirname, 'assets/database/database.db')
    }
    // console.log(dbFilePath)

    sqlite3.verbose();
    const db: sqlite3.Database = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log(err)
      }
    });
    return db;
  }

  public run(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.run(query, (err) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(true)
        }
      })
    });
  }

  public get(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.get(query, (err, row) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(row)
        }
      })
    });
  }

  public all(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = this.getDb()
      db.all(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows)
        }
      })
    });
  }

  private async clearDb() {
    const tableList = await this.getTableList()
    tableList.forEach(async (value: any) => {
      await this.run(`DELETE FROM ${value.name};`);
    })
    return await this.run('VACUUM;')
  }

  private async dbInit(): Promise<void> {
    await this.clearDb()
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
    // episodes
    await this.run(`
      CREATE TABLE episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        translation_name TEXT,
        novel_id INTEGER NOT NULL
      );
      `);
    // chapters
    await this.run(`
      CREATE TABLE chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        translation_name TEXT,
        episode_id INTEGER NOT NULL,
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
        episode_id INTEGER NOT NULL,
        original TEXT NOT NULL,
        translation TEXT,       
        created TEXT NOT NULL,
        updated TEXT NOT NULL
      );
      `);

    // comparison
    await this.run(`
    CREATE TABLE sentences (
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
        chapter_id INTEGER NOT NULL,
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
    const check = await this.checkDbIntegrity()

    // console.log(check)
    if (check === false) {
      console.log('db init!')
      this.dbInit()
    }
  }

}
