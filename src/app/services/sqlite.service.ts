import { Injectable } from '@angular/core';
import { SqliteCoreService } from './sqlite-core.service';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  constructor(
    private sqlCore: SqliteCoreService
  ) { }
  init() {
    this.sqlCore.init()
  }
}
