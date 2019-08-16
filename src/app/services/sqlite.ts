import {environment} from '../../environments/environment';
import {SQLite} from '@ionic-native/sqlite/ngx';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLiteObject} from '@ionic-native/sqlite';

declare var window: any;

export class SQLDatabase {
  private database;
  public cache = environment.editable ? {} : CACHE;

  constructor(private sqlitePorter: SQLitePorter, private sqlite: SQLite) {

  }

  init(): Promise<any> {
    if (environment.editable) {
      return this.sqlite.create({
        name: 'statistak.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
      });
    } else {
      return new Promise(resolve => resolve());
    }
  }

  checkSqlInCache(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cache[sql]) {
        resolve(this.cache[sql]);
      } else {
        console.error('Query', sql, 'not found');
        reject();
      }
    });
  }

  run(sql) {
    if (environment.editable) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.database.executeSql(sql);
          resolve();
        } catch (e) {
          if (!e.hasOwnProperty('rows')) {
            reject(e);
          } else {
            resolve(e);
          }
        }
      });
    } else {
      return this.checkSqlInCache(sql);
    }
  }

  import(sql) {
    if (environment.editable) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.sqlitePorter.importSqlToDb(this.database, sql);
          resolve();
        } catch (e) {
          resolve();
        }
      });
    } else {
      return new Promise(resolve => resolve());
    }
  }

  exec(sql): Promise<any[]> {
    if (environment.editable) {
      return new Promise(async (resolve, reject) => {
        let res;
        try {
          res = await this.database.executeSql(sql, []);
        } catch (e) {
          if (!e.hasOwnProperty('rows')) {
            console.log(e);
            reject(e);
            return;
          }
        }

        const values = [];
        for (let i = 0; i < res.rows.length; i++) {
          values.push({...res.rows.item(i)});
        }

        this.cache[sql] = [...values];

        resolve(values);
      });
    } else {
      return this.checkSqlInCache(sql) as Promise<any[]>;
    }
  }

  execWithVars(sql, vars) {
    let query = sql;
    for (const value of vars) {
      const replacedVal = typeof value === 'string' ? value.replace(/'/g, '\\\'') : value;
      query = query.replace('?', '\'' + replacedVal + '\'');
    }
    return this.exec(query);
  }

  export() {
    return this.sqlitePorter.exportDbToSql(this.database);
  }
}

const CACHE = {};
