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
// const CACHE = {
//   'SELECT * FROM optreden': [{
//     'id': 3,
//     'locatie': 'Amerpoort',
//     'plaats': 'Baarn',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-25',
//     'tijd': '18:30',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 144,
//     'gastdirigent': 'René',
//     'opmerkingen': ''
//   }, {
//     'id': 4,
//     'locatie': 'Maassluise muziekweek',
//     'plaats': 'Maassluis',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-27',
//     'tijd': '14:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 286,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 5,
//     'locatie': 'Cordaan',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-27',
//     'tijd': '16:30',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 41,
//     'gastdirigent': 'Dirk',
//     'opmerkingen': ''
//   }, {
//     'id': 6,
//     'locatie': 'Mike\'s Badhuistheater',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-27',
//     'tijd': '19:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 217,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 7,
//     'locatie': 'Stad als Podium',
//     'plaats': 'Harderwijk',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-28',
//     'tijd': '12:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 286,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 8,
//     'locatie': 'De Biltse Hof',
//     'plaats': 'Bilthoven',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-28',
//     'tijd': '14:15',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 24,
//     'gastdirigent': '',
//     'opmerkingen': 'Voor vriendin van Seringe'
//   }, {
//     'id': 9,
//     'locatie': 'St. Antonius Ziekenhuis',
//     'plaats': 'Utrecht',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-28',
//     'tijd': '17:05',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 22,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 10,
//     'locatie': 'Hoge Woerd',
//     'plaats': 'Utrecht',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-28',
//     'tijd': '15:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 318,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 11,
//     'locatie': 'Theater Lombok',
//     'plaats': 'Utrecht',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-28',
//     'tijd': '17:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 241,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 12,
//     'locatie': 'Mytylschool Kleine Prins',
//     'plaats': 'Utrecht',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-29',
//     'tijd': '09:30',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 23,
//     'gastdirigent': 'Daan',
//     'opmerkingen': ''
//   }, {
//     'id': 13,
//     'locatie': 'AZC',
//     'plaats': 'Oisterwijk',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-29',
//     'tijd': '12:45',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 135,
//     'gastdirigent': 'Lenna',
//     'opmerkingen': ''
//   }, {
//     'id': 14,
//     'locatie': 'AZC',
//     'plaats': 'Gilze en Rijen',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-29',
//     'tijd': '15:45',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 82,
//     'gastdirigent': 'Abdelrahman',
//     'opmerkingen': ''
//   }, {
//     'id': 15,
//     'locatie': 'Boerderij Natuurlijk',
//     'plaats': 'Lage Mierde',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-29',
//     'tijd': '16:45',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 29,
//     'gastdirigent': 'Iara',
//     'opmerkingen': ''
//   }, {
//     'id': 16,
//     'locatie': 'Genneper Hoeve',
//     'plaats': 'Eindhoven',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-29',
//     'tijd': '19:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 243,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 17,
//     'locatie': 'Openluchtmuseum',
//     'plaats': 'Arnhem',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-30',
//     'tijd': '11:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 176,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 18,
//     'locatie': 'Joachim & Anna',
//     'plaats': 'Nijmegen',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-30',
//     'tijd': '14:30',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 109,
//     'gastdirigent': 'Michel',
//     'opmerkingen': ''
//   }, {
//     'id': 19,
//     'locatie': 'AZC',
//     'plaats': 'Grave',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-30',
//     'tijd': '16:00',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 89,
//     'gastdirigent': 'Ruben',
//     'opmerkingen': ''
//   }, {
//     'id': 20,
//     'locatie': 'Kasteel Tongelaar',
//     'plaats': 'Mill',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-30',
//     'tijd': '19:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 346,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 21,
//     'locatie': 'Zon en Schild',
//     'plaats': 'Amersfoort',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '10:15',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 39,
//     'gastdirigent': 'Edwin',
//     'opmerkingen': ''
//   }, {
//     'id': 22,
//     'locatie': 'Winkelcentrum Schalkwijk',
//     'plaats': 'Haarlem',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '13:30',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 146,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 23,
//     'locatie': 'Stem in de Stad',
//     'plaats': 'Haarlem',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '15:00',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 52,
//     'gastdirigent': 'Wim',
//     'opmerkingen': ''
//   }, {
//     'id': 24,
//     'locatie': 'Tolhuistuin',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '20:00',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 234,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 25,
//     'locatie': 'Amsterdam Centraal',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '18:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 223,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 26,
//     'locatie': 'Daklozenopvang Poeldijkstraat',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '09:00',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 32,
//     'gastdirigent': 'Danny',
//     'opmerkingen': ''
//   }, {
//     'id': 27,
//     'locatie': 'Amsterdam Amstel',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '11:20',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 170,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 28,
//     'locatie': 'Inforsa, gesloten psychiatrie',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '13:00',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 52,
//     'gastdirigent': 'Thomas',
//     'opmerkingen': ''
//   }, {
//     'id': 29,
//     'locatie': 'OLVG Oost',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '15:15',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 124,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 30,
//     'locatie': 'Kop van Zuid',
//     'plaats': 'Rotterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '18:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 67,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 31,
//     'locatie': 'Tante Nino',
//     'plaats': 'Rotterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '20:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 224,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 32,
//     'locatie': 'Kiev Airport',
//     'plaats': 'Kiev',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-02',
//     'tijd': '20:15',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 465,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 33,
//     'locatie': 'National Gallery',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-03',
//     'tijd': '12:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 82,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 34,
//     'locatie': 'Nationaal Museum',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-03',
//     'tijd': '16:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 142,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 35,
//     'locatie': 'Voor VN gebouw (Round Garden)',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-03',
//     'tijd': '17:50',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 54,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 36,
//     'locatie': 'Turtle Lake',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-03',
//     'tijd': '18:45',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 88,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 37,
//     'locatie': 'Orbeliani Square',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-03',
//     'tijd': '22:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 211,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 38,
//     'locatie': 'Opvang voor ouderen',
//     'plaats': 'Rustavi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-04',
//     'tijd': '12:30',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 71,
//     'gastdirigent': 'Ludmila',
//     'opmerkingen': ''
//   }, {
//     'id': 39,
//     'locatie': 'Park of Culture and Rest',
//     'plaats': 'Rustavi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-04',
//     'tijd': '15:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 114,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 40,
//     'locatie': 'Rustaveli plein',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-04',
//     'tijd': '18:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 146,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 41,
//     'locatie': 'Davit Aghmashenebeli Avenue',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-04',
//     'tijd': '21:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 194,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 42,
//     'locatie': 'Military Hospital',
//     'plaats': 'Gori',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-05',
//     'tijd': '11:20',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 129,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 43,
//     'locatie': 'Voor het theater van Gori',
//     'plaats': 'Gori',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-05',
//     'tijd': '14:15',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 94,
//     'gastdirigent': 'Giorgi',
//     'opmerkingen': 'Met gastzanger bij Chveno'
//   }, {
//     'id': 44,
//     'locatie': 'Rondje door Vluchtelingenkamp',
//     'plaats': 'Tserovani',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-05',
//     'tijd': '16:45',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 45,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 45,
//     'locatie': 'Theaterzaal Vluchtelingenkamp',
//     'plaats': 'Tserovani',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-05',
//     'tijd': '19:00',
//     'isBuiten': 0,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 89,
//     'gastdirigent': 'Luka',
//     'opmerkingen': ''
//   }, {
//     'id': 46,
//     'locatie': 'Voor City Hall',
//     'plaats': 'Chiatura',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-06',
//     'tijd': '12:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 161,
//     'gastdirigent': '',
//     'opmerkingen': 'Met fontein'
//   }, {
//     'id': 47,
//     'locatie': 'Verzorgingshuis voor ouderen',
//     'plaats': 'Kutaisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-06',
//     'tijd': '17:15',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 0,
//     'isBesloten': 1,
//     'isWildOp': 0,
//     'aantalBezoekers': 83,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 48,
//     'locatie': 'Witte Brug',
//     'plaats': 'Kutaisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-06',
//     'tijd': '20:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 220,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 49,
//     'locatie': 'Voor Papavero',
//     'plaats': 'Kutaisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-06',
//     'tijd': '22:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 189,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 50,
//     'locatie': 'Hotel',
//     'plaats': 'Bakhmaro',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-07',
//     'tijd': '17:00',
//     'isBuiten': 0,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 243,
//     'gastdirigent': 'Anastasia',
//     'opmerkingen': ''
//   }, {
//     'id': 51,
//     'locatie': 'Verzorgingshuis voor ouderen',
//     'plaats': 'Batumi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-08',
//     'tijd': '12:15',
//     'isBuiten': 1,
//     'isSociaal': 1,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 117,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 52,
//     'locatie': '6 Mei Park',
//     'plaats': 'Batumi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-08',
//     'tijd': '14:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 105,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 53,
//     'locatie': 'Medeaplein',
//     'plaats': 'Batumi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-08',
//     'tijd': '20:45',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 227,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 54,
//     'locatie': 'Boulevard',
//     'plaats': 'Batumi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-08',
//     'tijd': '22:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 342,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 55,
//     'locatie': 'Fabrika',
//     'plaats': 'Tbilisi',
//     'landCode': 'ge',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-09',
//     'tijd': '21:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 1,
//     'isBesloten': 0,
//     'isWildOp': 0,
//     'aantalBezoekers': 1281,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 56,
//     'locatie': 'Pont van Amsterdam Noord naar Amsterdam Centraal en terug',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '17:40',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 187,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }, {
//     'id': 57,
//     'locatie': 'Katendrecht',
//     'plaats': 'Rotterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '18:30',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 213,
//     'gastdirigent': '',
//     'opmerkingen': 'Met Van Dyke'
//   }],
//   'SELECT * FROM stuk': [{
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {'id': 7, 'titel': 'Lezginka', 'componist': 'M. Ippolitov-Ivanov', 'code': '07', 'metSolist1': 0, 'metSolist2': 0}, {
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {'id': 18, 'titel': 'Onleesbaar 3', 'componist': 'W. Breuker', 'code': '17', 'metSolist1': 0, 'metSolist2': 0}, {
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {'id': 31, 'titel': 'Oopsala', 'componist': 'G. Kramers', 'code': 'L', 'metSolist1': 0, 'metSolist2': 0}, {
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'id': 35,
//     'titel': 'Fantasie',
//     'componist': 'J. N. Hummel (arr. M. Kugel)',
//     'code': 'X',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {'id': 36, 'titel': 'Georgisch Volkslied', 'componist': '', 'code': 'V', 'metSolist1': 0, 'metSolist2': 0}],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'3\'': [{
//     'optredenId': 3,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 24,
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 3,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 3,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 3,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'4\'': [{
//     'optredenId': 4,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 4,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 4,
//     'stukId': 35,
//     'id': 35,
//     'titel': 'Fantasie',
//     'componist': 'J. N. Hummel (arr. M. Kugel)',
//     'code': 'X',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'5\'': [{
//     'optredenId': 5,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 5,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'6\'': [{
//     'optredenId': 6,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 6,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 6,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'7\'': [{
//     'optredenId': 7,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 13,
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 7,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'8\'': [{
//     'optredenId': 8,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 8,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 8,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'9\'': [{
//     'optredenId': 9,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'10\'': [{
//     'optredenId': 10,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 4,
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 10,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'11\'': [{
//     'optredenId': 11,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 11,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'12\'': [{
//     'optredenId': 12,
//     'stukId': 2,
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 4,
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 24,
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 12,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 12,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'13\'': [{
//     'optredenId': 13,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 13,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 13,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 13,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 13,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 13,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 13,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'14\'': [{
//     'optredenId': 14,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 14,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 14,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 14,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 14,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 14,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'15\'': [{
//     'optredenId': 15,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 15,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'16\'': [{
//     'optredenId': 16,
//     'stukId': 4,
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 16,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 16,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 16,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'17\'': [{
//     'optredenId': 17,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 13,
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 17,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'18\'': [{
//     'optredenId': 18,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 18,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'19\'': [{
//     'optredenId': 19,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 2,
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 19,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'20\'': [{
//     'optredenId': 20,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 20,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 20,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 20,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'21\'': [{
//     'optredenId': 21,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 21,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 21,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 21,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 21,
//     'stukId': 24,
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 21,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 21,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 21,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'22\'': [{
//     'optredenId': 22,
//     'stukId': 2,
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 22,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'23\'': [{
//     'optredenId': 23,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 23,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 23,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 23,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 23,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 23,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 23,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 23,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'24\'': [{
//     'optredenId': 24,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 24,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'25\'': [{
//     'optredenId': 25,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 25,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'26\'': [{
//     'optredenId': 26,
//     'stukId': 4,
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 26,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 26,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 26,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 26,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 26,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'27\'': [{
//     'optredenId': 27,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 27,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 27,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'28\'': [{
//     'optredenId': 28,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 28,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 28,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 28,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 28,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 28,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 28,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'29\'': [{
//     'optredenId': 29,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 29,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 29,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'30\'': [{
//     'optredenId': 30,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'31\'': [{
//     'optredenId': 31,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 13,
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 31,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 31,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'32\'': [{
//     'optredenId': 32,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'33\'': [{
//     'optredenId': 33,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 33,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'34\'': [{
//     'optredenId': 34,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 24,
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 34,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 34,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'35\'': [{
//     'optredenId': 35,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 35,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 35,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'36\'': [{
//     'optredenId': 36,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 36,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 36,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'37\'': [{
//     'optredenId': 37,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 37,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'38\'': [{
//     'optredenId': 38,
//     'stukId': 4,
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 13,
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 38,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'39\'': [{
//     'optredenId': 39,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 7,
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 39,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'40\'': [{
//     'optredenId': 40,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 40,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 40,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 40,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 40,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 40,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'41\'': [{
//     'optredenId': 41,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 41,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 41,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 41,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 41,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'42\'': [{
//     'optredenId': 42,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 42,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 42,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'43\'': [{
//     'optredenId': 43,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 43,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 43,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'44\'': [{
//     'optredenId': 44,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'45\'': [{
//     'optredenId': 45,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 24,
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 45,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 45,
//     'stukId': 34,
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'46\'': [{
//     'optredenId': 46,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 18,
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 46,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 46,
//     'stukId': 33,
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'47\'': [{
//     'optredenId': 47,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 47,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 47,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'48\'': [{
//     'optredenId': 48,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 48,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 48,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'49\'': [{
//     'optredenId': 49,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 49,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 49,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 49,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'50\'': [{
//     'optredenId': 50,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 10,
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 50,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 50,
//     'stukId': 30,
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'51\'': [{
//     'optredenId': 51,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 6,
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 15,
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 51,
//     'stukId': 25,
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 51,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 51,
//     'stukId': 36,
//     'id': 36,
//     'titel': 'Georgisch Volkslied',
//     'componist': '',
//     'code': 'V',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'52\'': [{
//     'optredenId': 52,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 22,
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 26,
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 52,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 52,
//     'stukId': 36,
//     'id': 36,
//     'titel': 'Georgisch Volkslied',
//     'componist': '',
//     'code': 'V',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'53\'': [{
//     'optredenId': 53,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 13,
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 23,
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }, {
//     'optredenId': 53,
//     'stukId': 32,
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 53,
//     'stukId': 36,
//     'id': 36,
//     'titel': 'Georgisch Volkslied',
//     'componist': '',
//     'code': 'V',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'54\'': [{
//     'optredenId': 54,
//     'stukId': 5,
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 8,
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 9,
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 28,
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 54,
//     'stukId': 36,
//     'id': 36,
//     'titel': 'Georgisch Volkslied',
//     'componist': '',
//     'code': 'V',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'55\'': [{
//     'optredenId': 55,
//     'stukId': 1,
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 2,
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 3,
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 11,
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 14,
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 16,
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 17,
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 19,
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 20,
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 21,
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 27,
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }, {
//     'optredenId': 55,
//     'stukId': 29,
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM optreden WHERE id = \'25\'': [{
//     'id': 25,
//     'locatie': 'Amsterdam Centraal',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '18:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 223,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }],
//   '\n    UPDATE optreden SET locatie = \'Amsterdam Centraal\', plaats = \'Amsterdam\', landCode = \'nl\', longitude = \'0\', latitude = \'0\', datum = \'2019-07-31\', tijd = \'18:00\',\n      isBuiten = \'1\', isSociaal = \'0\', isOpenbaar = \'0\', isBesloten = \'0\', isWildOp = \'1\', aantalBezoekers = \'223\', gastdirigent = \'\', opmerkingen = \'\'\n      WHERE id = 25': [],
//   '\n    INSERT INTO optreden (locatie, plaats, landCode, longitude, latitude, datum, tijd, isBuiten,\n    isSociaal, isOpenbaar, isBesloten, isWildOp, aantalBezoekers, gastdirigent, opmerkingen)\n    VALUES (\'Pont naar en van Amsterdam Centraal\', \'Amsterdam\', \'nl\', \'0\', \'0\', \'2019-07-31\', \'17:40\', \'1\', \'0\', \'0\', \'0\', \'1\', \'187\', \'\', \'\')': [],
//   'SELECT seq FROM sqlite_sequence WHERE name=\'optreden\'': [{'seq': 57}],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'56\'': [{
//     'optredenId': 56,
//     'stukId': 31,
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM optreden WHERE id = \'30\'': [{
//     'id': 30,
//     'locatie': 'Hotel New York & Fenix Food Factory',
//     'plaats': 'Rotterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-08-01',
//     'tijd': '18:00',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 257,
//     'gastdirigent': '',
//     'opmerkingen': 'Met Van Dyke'
//   }],
//   'SELECT * FROM optreden WHERE id = \'56\'': [{
//     'id': 56,
//     'locatie': 'Pont naar en van Amsterdam Centraal',
//     'plaats': 'Amsterdam',
//     'landCode': 'nl',
//     'longitude': 0,
//     'latitude': 0,
//     'datum': '2019-07-31',
//     'tijd': '17:40',
//     'isBuiten': 1,
//     'isSociaal': 0,
//     'isOpenbaar': 0,
//     'isBesloten': 0,
//     'isWildOp': 1,
//     'aantalBezoekers': 187,
//     'gastdirigent': '',
//     'opmerkingen': ''
//   }],
//   '\n    UPDATE optreden SET locatie = \'Pont van Amsterdam Noord naar Amsterdam Centraal en terug\', plaats = \'Amsterdam\', landCode = \'nl\', longitude = \'0\', latitude = \'0\', datum = \'2019-07-31\', tijd = \'17:40\',\n      isBuiten = \'1\', isSociaal = \'0\', isOpenbaar = \'0\', isBesloten = \'0\', isWildOp = \'1\', aantalBezoekers = \'187\', gastdirigent = \'\', opmerkingen = \'\'\n      WHERE id = 56': [],
//   '\n    UPDATE optreden SET locatie = \'Kop van Zuid\', plaats = \'Rotterdam\', landCode = \'nl\', longitude = \'0\', latitude = \'0\', datum = \'2019-08-01\', tijd = \'18:00\',\n      isBuiten = \'1\', isSociaal = \'0\', isOpenbaar = \'0\', isBesloten = \'0\', isWildOp = \'1\', aantalBezoekers = \'67\', gastdirigent = \'\', opmerkingen = \'\'\n      WHERE id = 30': [],
//   '\n    INSERT INTO optreden (locatie, plaats, landCode, longitude, latitude, datum, tijd, isBuiten,\n    isSociaal, isOpenbaar, isBesloten, isWildOp, aantalBezoekers, gastdirigent, opmerkingen)\n    VALUES (\'Katendrecht\', \'Rotterdam\', \'nl\', \'0\', \'0\', \'2019-08-01\', \'18:30\', \'1\', \'0\', \'0\', \'0\', \'1\', \'213\', \'\', \'Met Van Dyke\')': [],
//   '\n    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id\n    WHERE optreden_repertoire.optredenId = \'57\'': [{
//     'optredenId': 57,
//     'stukId': 12,
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT count(*) AS numOptredens, datum FROM optreden GROUP BY datum': [{'numOptredens': 1, 'datum': '2019-07-25'}, {
//     'numOptredens': 3,
//     'datum': '2019-07-27'
//   }, {'numOptredens': 5, 'datum': '2019-07-28'}, {'numOptredens': 5, 'datum': '2019-07-29'}, {
//     'numOptredens': 4,
//     'datum': '2019-07-30'
//   }, {'numOptredens': 6, 'datum': '2019-07-31'}, {'numOptredens': 7, 'datum': '2019-08-01'}, {
//     'numOptredens': 1,
//     'datum': '2019-08-02'
//   }, {'numOptredens': 5, 'datum': '2019-08-03'}, {'numOptredens': 4, 'datum': '2019-08-04'}, {
//     'numOptredens': 4,
//     'datum': '2019-08-05'
//   }, {'numOptredens': 4, 'datum': '2019-08-06'}, {'numOptredens': 1, 'datum': '2019-08-07'}, {
//     'numOptredens': 4,
//     'datum': '2019-08-08'
//   }, {'numOptredens': 1, 'datum': '2019-08-09'}],
//   '\n    SELECT count(*) AS numOptredens FROM optreden ': [{'numOptredens': 55}],
//   '\n    SELECT count(*) AS numOptredens FROM optreden WHERE landCode = \'nl\'': [{'numOptredens': 31}],
//   '\n    SELECT count(*) AS numOptredens FROM optreden WHERE landCode = \'ge\'': [{'numOptredens': 24}],
//   '\n    SELECT sum(aantalBezoekers) AS aantalBezoekers FROM optreden ': [{'aantalBezoekers': 9466}],
//   '\n    SELECT sum(aantalBezoekers) AS aantalBezoekers FROM optreden WHERE landCode = \'nl\'': [{'aantalBezoekers': 4574}],
//   '\n    SELECT sum(aantalBezoekers) AS aantalBezoekers FROM optreden WHERE landCode = \'ge\'': [{'aantalBezoekers': 4892}],
//   '\n    SELECT AVG(isWildOp) AS percentage FROM optreden ': [{'percentage': 0.2}],
//   '\n    SELECT AVG(isWildOp) AS percentage FROM optreden WHERE landCode = \'nl\'': [{'percentage': 0.22580645161290322}],
//   '\n    SELECT AVG(isWildOp) AS percentage FROM optreden WHERE landCode = \'ge\'': [{'percentage': 0.16666666666666666}],
//   '\n    SELECT AVG(isBuiten) AS percentage FROM optreden ': [{'percentage': 0.7636363636363637}],
//   '\n    SELECT AVG(isBuiten) AS percentage FROM optreden WHERE landCode = \'nl\'': [{'percentage': 0.6774193548387096}],
//   '\n    SELECT AVG(isBuiten) AS percentage FROM optreden WHERE landCode = \'ge\'': [{'percentage': 0.875}],
//   '\n    SELECT avg(numOptredens) AS avgNumOptredens FROM\n    (SELECT count(*) AS numOptredens FROM optreden\n    WHERE landCode = \'nl\' GROUP BY datum)': [{'avgNumOptredens': 4.428571428571429}],
//   '\n    SELECT avg(numOptredens) AS avgNumOptredens FROM\n    (SELECT count(*) AS numOptredens FROM optreden\n    WHERE landCode = \'ge\' GROUP BY datum)': [{'avgNumOptredens': 3}],
//   '\n    SELECT AVG(isSociaal) AS percentage FROM optreden ': [{'percentage': 0.34545454545454546}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist1) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    \n    GROUP BY optredenId)': [{'percentage': 0.7454545454545455}],
//   'SELECT * FROM stuk WHERE id = \'5\'': [{
//     'id': 5,
//     'titel': 'Masquerade: Waltz',
//     'componist': 'A. Khachaturian',
//     'code': '05a',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT AVG(isSociaal) AS percentage FROM optreden WHERE landCode = \'nl\'': [{'percentage': 0.41935483870967744}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist1) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    WHERE optreden.landCode = \'nl\'\n    GROUP BY optredenId)': [{'percentage': 0.7096774193548387}],
//   'SELECT * FROM stuk WHERE id = \'3\'': [{
//     'id': 3,
//     'titel': 'Prometheus ouverture',
//     'componist': 'L. van Beethoven',
//     'code': '03',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT AVG(isSociaal) AS percentage FROM optreden WHERE landCode = \'ge\'': [{'percentage': 0.25}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist1) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    WHERE optreden.landCode = \'ge\'\n    GROUP BY optredenId)': [{'percentage': 0.7916666666666666}],
//   'SELECT * FROM stuk WHERE id = \'7\'': [{
//     'id': 7,
//     'titel': 'Lezginka',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': '07',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT AVG(isOpenbaar) AS percentage FROM optreden ': [{'percentage': 0.6363636363636364}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist2) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    \n    GROUP BY optredenId)': [{'percentage': 0.43636363636363634}],
//   '\n    SELECT AVG(isOpenbaar) AS percentage FROM optreden WHERE landCode = \'nl\'': [{'percentage': 0.5161290322580645}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist2) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    WHERE optreden.landCode = \'nl\'\n    GROUP BY optredenId)': [{'percentage': 0.3870967741935484}],
//   '\n    SELECT AVG(isOpenbaar) AS percentage FROM optreden WHERE landCode = \'ge\'': [{'percentage': 0.7916666666666666}],
//   '\n    SELECT AVG(solist) AS percentage FROM\n    (SELECT MAX(stuk.metSolist2) AS solist FROM optreden_repertoire\n    JOIN optreden ON optreden.id = optredenId\n    JOIN stuk ON stuk.id = stukId\n    WHERE optreden.landCode = \'ge\'\n    GROUP BY optredenId)': [{'percentage': 0.5}],
//   '\n    SELECT AVG(isBesloten) AS percentage FROM optreden ': [{'percentage': 0.16363636363636364}],
//   'SELECT * FROM stuk WHERE id = \'11\'': [{
//     'id': 11,
//     'titel': 'Procession of the Sardar - Jazz',
//     'componist': 'M. Ippolitov-Ivanov (arr. V. Veneman)',
//     'code': '11',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT AVG(isBesloten) AS percentage FROM optreden WHERE landCode = \'nl\'': [{'percentage': 0.25806451612903225}],
//   '\n    SELECT AVG(isBesloten) AS percentage FROM optreden WHERE landCode = \'ge\'': [{'percentage': 0.041666666666666664}],
//   'SELECT * FROM stuk WHERE id = \'12\'': [{
//     'id': 12,
//     'titel': 'The Devil went down to Georgia',
//     'componist': 'C. Daniels (arr. D. Nauta)',
//     'code': '12',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'24\'': [{
//     'id': 24,
//     'titel': 'Quell amor, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '24',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }],
//   'SELECT * FROM stuk WHERE id = \'26\'': [{
//     'id': 26,
//     'titel': 'Nine Million Bicycles',
//     'componist': 'Katie Melua (arr. A. Hensens)',
//     'code': '26',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }],
//   'SELECT * FROM stuk WHERE id = \'30\'': [{
//     'id': 30,
//     'titel': 'Procession of the Sardar - Origineel',
//     'componist': 'M. Ippolitov-Ivanov',
//     'code': 'G',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'31\'': [{
//     'id': 31,
//     'titel': 'Oopsala',
//     'componist': 'G. Kramers',
//     'code': 'L',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'33\'': [{
//     'id': 33,
//     'titel': 'Masquerade: Galop',
//     'componist': 'A. Khachaturian',
//     'code': '05c',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'6\'': [{
//     'id': 6,
//     'titel': 'Abesalom da Eteri',
//     'componist': 'Z. Paliashvili',
//     'code': '06',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'8\'': [{
//     'id': 8,
//     'titel': 'Sachidao',
//     'componist': 'R. Lagidze (arr. H. Bouma)',
//     'code': '08',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'34\'': [{
//     'id': 34,
//     'titel': 'Damiskhi Damalevine',
//     'componist': 'Mgzavrebi (arr. Bram Faber)',
//     'code': '18',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'35\'': [{
//     'id': 35,
//     'titel': 'Fantasie',
//     'componist': 'J. N. Hummel (arr. M. Kugel)',
//     'code': 'X',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'1\'': [{
//     'id': 1,
//     'titel': 'Sta op en schitter',
//     'componist': 'E. de Boer',
//     'code': '01',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'10\'': [{
//     'id': 10,
//     'titel': 'Sweet Georgia Brown',
//     'componist': 'B. Bernie (arr. R. Scherpenisse)',
//     'code': '10',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'21\'': [{
//     'id': 21,
//     'titel': 'Romanze',
//     'componist': 'D. Toradze (arr. Misha Sporck)',
//     'code': '21',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'29\'': [{
//     'id': 29,
//     'titel': 'Clarinet concerto',
//     'componist': 'A. Shaw (arr. T. Parson)',
//     'code': 'B',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'9\'': [{
//     'id': 9,
//     'titel': 'Georgia on my mind',
//     'componist': 'H. Carmichael (arr. D. Herweg)',
//     'code': '09',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'16\'': [{
//     'id': 16,
//     'titel': 'Mgzavruli',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '16',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'18\'': [{
//     'id': 18,
//     'titel': 'Onleesbaar 3',
//     'componist': 'W. Breuker',
//     'code': '17',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'19\'': [{
//     'id': 19,
//     'titel': 'Kancheliade',
//     'componist': 'G. Kancheli (arr. H. Bouma)',
//     'code': '19',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'25\'': [{
//     'id': 25,
//     'titel': 'Dolce riposo, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '25',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }],
//   'SELECT * FROM stuk WHERE id = \'17\'': [{
//     'id': 17,
//     'titel': 'De gepikte vogel',
//     'componist': 'J. Andriessen',
//     'code': 'GV',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'28\'': [{
//     'id': 28,
//     'titel': 'Miniaturen voor strijkkwartet',
//     'componist': 'S. Tsintsadze',
//     'code': 'S',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'32\'': [{
//     'id': 32,
//     'titel': 'Masquerade: Nocturne',
//     'componist': 'A. Khachaturian',
//     'code': '05b',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'13\'': [{
//     'id': 13,
//     'titel': 'Tu ase turpa ikavi',
//     'componist': 'T. Kevkhishvili (arr. B. Faber)',
//     'code': '13',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'14\'': [{
//     'id': 14,
//     'titel': 'Chveno Tbilis Kalako',
//     'componist': 'G. Tsabadze (arr. G. Rubingh)',
//     'code': '14',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'22\'': [{
//     'id': 22,
//     'titel': 'Concerto 2 deel 3',
//     'componist': 'S. Davitashvili',
//     'code': '22',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'27\'': [{
//     'id': 27,
//     'titel': 'Eens komt de dag',
//     'componist': 'W. Breuker (arr. B. Faber)',
//     'code': 'EK',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'4\'': [{
//     'id': 4,
//     'titel': 'Arabische dans',
//     'componist': 'P. Tchaikovsky',
//     'code': '04',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'15\'': [{
//     'id': 15,
//     'titel': 'Nana',
//     'componist': 'Traditional (arr. E. de Boer)',
//     'code': '15',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'20\'': [{
//     'id': 20,
//     'titel': 'Simghera Kutaisze',
//     'componist': 'Traditional (arr. A. Giorgobiani)',
//     'code': '20',
//     'metSolist1': 1,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'2\'': [{
//     'id': 2,
//     'titel': 'Born to be free',
//     'componist': 'A. Giorgobiani',
//     'code': '02',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   'SELECT * FROM stuk WHERE id = \'23\'': [{
//     'id': 23,
//     'titel': 'Moriro, uit Teseo',
//     'componist': 'G. F. Händel (arr. C. Stuit)',
//     'code': '23',
//     'metSolist1': 0,
//     'metSolist2': 1
//   }],
//   'SELECT * FROM stuk WHERE id = \'36\'': [{
//     'id': 36,
//     'titel': 'Georgisch Volkslied',
//     'componist': '',
//     'code': 'V',
//     'metSolist1': 0,
//     'metSolist2': 0
//   }],
//   '\n    SELECT count(*) AS numOptredens, sum(aantalBezoekers) AS bezoekers, stukId FROM \n    (SELECT stukId, optreden.aantalBezoekers AS aantalBezoekers FROM optreden_repertoire\n    JOIN stuk ON stuk.id = stukId\n    JOIN optreden ON optreden.id = optredenId )\n    GROUP BY stukId ORDER BY numOptredens DESC': [{
//     'numOptredens': 24,
//     'bezoekers': 5119,
//     'stukId': 12
//   }, {'numOptredens': 23, 'bezoekers': 5264, 'stukId': 29}, {'numOptredens': 22, 'bezoekers': 4585, 'stukId': 3}, {
//     'numOptredens': 19,
//     'bezoekers': 4011,
//     'stukId': 14
//   }, {'numOptredens': 19, 'bezoekers': 3805, 'stukId': 21}, {'numOptredens': 19, 'bezoekers': 3289, 'stukId': 31}, {
//     'numOptredens': 18,
//     'bezoekers': 4151,
//     'stukId': 11
//   }, {'numOptredens': 18, 'bezoekers': 3735, 'stukId': 27}, {'numOptredens': 17, 'bezoekers': 3041, 'stukId': 8}, {
//     'numOptredens': 17,
//     'bezoekers': 4499,
//     'stukId': 17
//   }, {'numOptredens': 17, 'bezoekers': 2917, 'stukId': 28}, {'numOptredens': 16, 'bezoekers': 3195, 'stukId': 20}, {
//     'numOptredens': 15,
//     'bezoekers': 2522,
//     'stukId': 18
//   }, {'numOptredens': 15, 'bezoekers': 1253, 'stukId': 30}, {'numOptredens': 14, 'bezoekers': 1928, 'stukId': 5}, {
//     'numOptredens': 13,
//     'bezoekers': 1885,
//     'stukId': 34
//   }, {'numOptredens': 12, 'bezoekers': 3567, 'stukId': 16}, {'numOptredens': 12, 'bezoekers': 3663, 'stukId': 19}, {
//     'numOptredens': 12,
//     'bezoekers': 1920,
//     'stukId': 26
//   }, {'numOptredens': 11, 'bezoekers': 2810, 'stukId': 1}, {'numOptredens': 11, 'bezoekers': 1846, 'stukId': 9}, {
//     'numOptredens': 11,
//     'bezoekers': 2027,
//     'stukId': 10
//   }, {'numOptredens': 9, 'bezoekers': 1259, 'stukId': 15}, {'numOptredens': 8, 'bezoekers': 1172, 'stukId': 22}, {
//     'numOptredens': 8,
//     'bezoekers': 1468,
//     'stukId': 23
//   }, {'numOptredens': 8, 'bezoekers': 1549, 'stukId': 33}, {'numOptredens': 7, 'bezoekers': 1402, 'stukId': 6}, {
//     'numOptredens': 7,
//     'bezoekers': 1339,
//     'stukId': 7
//   }, {'numOptredens': 7, 'bezoekers': 875, 'stukId': 25}, {'numOptredens': 7, 'bezoekers': 1448, 'stukId': 32}, {
//     'numOptredens': 5,
//     'bezoekers': 687,
//     'stukId': 4
//   }, {'numOptredens': 5, 'bezoekers': 984, 'stukId': 13}, {'numOptredens': 5, 'bezoekers': 437, 'stukId': 24}, {
//     'numOptredens': 4,
//     'bezoekers': 1539,
//     'stukId': 2
//   }, {'numOptredens': 4, 'bezoekers': 791, 'stukId': 36}, {'numOptredens': 1, 'bezoekers': 286, 'stukId': 35}],
//   '\n    SELECT count(*) AS numOptredens, sum(aantalBezoekers) AS bezoekers, stukId FROM \n    (SELECT stukId, optreden.aantalBezoekers AS aantalBezoekers FROM optreden_repertoire\n    JOIN stuk ON stuk.id = stukId\n    JOIN optreden ON optreden.id = optredenId WHERE landCode = \'nl\')\n    GROUP BY stukId ORDER BY numOptredens DESC': [{
//     'numOptredens': 15,
//     'bezoekers': 2538,
//     'stukId': 12
//   }, {'numOptredens': 13, 'bezoekers': 2154, 'stukId': 3}, {'numOptredens': 12, 'bezoekers': 2341, 'stukId': 29}, {
//     'numOptredens': 12,
//     'bezoekers': 827,
//     'stukId': 30
//   }, {'numOptredens': 11, 'bezoekers': 1384, 'stukId': 21}, {'numOptredens': 10, 'bezoekers': 1986, 'stukId': 8}, {
//     'numOptredens': 10,
//     'bezoekers': 1634,
//     'stukId': 11
//   }, {'numOptredens': 10, 'bezoekers': 1951, 'stukId': 18}, {'numOptredens': 10, 'bezoekers': 1772, 'stukId': 31}, {
//     'numOptredens': 8,
//     'bezoekers': 979,
//     'stukId': 5
//   }, {'numOptredens': 8, 'bezoekers': 1403, 'stukId': 14}, {'numOptredens': 8, 'bezoekers': 1174, 'stukId': 27}, {
//     'numOptredens': 8,
//     'bezoekers': 1260,
//     'stukId': 34
//   }, {'numOptredens': 7, 'bezoekers': 1465, 'stukId': 10}, {'numOptredens': 7, 'bezoekers': 1529, 'stukId': 17}, {
//     'numOptredens': 6,
//     'bezoekers': 975,
//     'stukId': 1
//   }, {'numOptredens': 6, 'bezoekers': 1225, 'stukId': 7}, {'numOptredens': 6, 'bezoekers': 972, 'stukId': 9}, {
//     'numOptredens': 6,
//     'bezoekers': 982,
//     'stukId': 15
//   }, {'numOptredens': 6, 'bezoekers': 1582, 'stukId': 19}, {'numOptredens': 6, 'bezoekers': 668, 'stukId': 20}, {
//     'numOptredens': 6,
//     'bezoekers': 1123,
//     'stukId': 26
//   }, {'numOptredens': 6, 'bezoekers': 1265, 'stukId': 28}, {'numOptredens': 6, 'bezoekers': 1317, 'stukId': 33}, {
//     'numOptredens': 5,
//     'bezoekers': 1214,
//     'stukId': 6
//   }, {'numOptredens': 5, 'bezoekers': 1281, 'stukId': 16}, {'numOptredens': 5, 'bezoekers': 871, 'stukId': 22}, {
//     'numOptredens': 5,
//     'bezoekers': 881,
//     'stukId': 23
//   }, {'numOptredens': 5, 'bezoekers': 675, 'stukId': 25}, {'numOptredens': 4, 'bezoekers': 616, 'stukId': 4}, {
//     'numOptredens': 4,
//     'bezoekers': 987,
//     'stukId': 32
//   }, {'numOptredens': 3, 'bezoekers': 258, 'stukId': 2}, {'numOptredens': 3, 'bezoekers': 686, 'stukId': 13}, {
//     'numOptredens': 3,
//     'bezoekers': 206,
//     'stukId': 24
//   }, {'numOptredens': 1, 'bezoekers': 286, 'stukId': 35}],
//   '\n    SELECT count(*) AS numOptredens, sum(aantalBezoekers) AS bezoekers, stukId FROM \n    (SELECT stukId, optreden.aantalBezoekers AS aantalBezoekers FROM optreden_repertoire\n    JOIN stuk ON stuk.id = stukId\n    JOIN optreden ON optreden.id = optredenId WHERE landCode = \'ge\')\n    GROUP BY stukId ORDER BY numOptredens DESC': [{
//     'numOptredens': 11,
//     'bezoekers': 2608,
//     'stukId': 14
//   }, {'numOptredens': 11, 'bezoekers': 1652, 'stukId': 28}, {'numOptredens': 11, 'bezoekers': 2923, 'stukId': 29}, {
//     'numOptredens': 10,
//     'bezoekers': 2970,
//     'stukId': 17
//   }, {'numOptredens': 10, 'bezoekers': 2527, 'stukId': 20}, {'numOptredens': 10, 'bezoekers': 2561, 'stukId': 27}, {
//     'numOptredens': 9,
//     'bezoekers': 2431,
//     'stukId': 3
//   }, {'numOptredens': 9, 'bezoekers': 2581, 'stukId': 12}, {'numOptredens': 9, 'bezoekers': 1517, 'stukId': 31}, {
//     'numOptredens': 8,
//     'bezoekers': 2517,
//     'stukId': 11
//   }, {'numOptredens': 8, 'bezoekers': 2421, 'stukId': 21}, {'numOptredens': 7, 'bezoekers': 1055, 'stukId': 8}, {
//     'numOptredens': 7,
//     'bezoekers': 2286,
//     'stukId': 16
//   }, {'numOptredens': 6, 'bezoekers': 949, 'stukId': 5}, {'numOptredens': 6, 'bezoekers': 2081, 'stukId': 19}, {
//     'numOptredens': 6,
//     'bezoekers': 797,
//     'stukId': 26
//   }, {'numOptredens': 5, 'bezoekers': 1835, 'stukId': 1}, {'numOptredens': 5, 'bezoekers': 874, 'stukId': 9}, {
//     'numOptredens': 5,
//     'bezoekers': 571,
//     'stukId': 18
//   }, {'numOptredens': 5, 'bezoekers': 625, 'stukId': 34}, {'numOptredens': 4, 'bezoekers': 562, 'stukId': 10}, {
//     'numOptredens': 4,
//     'bezoekers': 791,
//     'stukId': 36
//   }, {'numOptredens': 3, 'bezoekers': 277, 'stukId': 15}, {'numOptredens': 3, 'bezoekers': 301, 'stukId': 22}, {
//     'numOptredens': 3,
//     'bezoekers': 587,
//     'stukId': 23
//   }, {'numOptredens': 3, 'bezoekers': 426, 'stukId': 30}, {'numOptredens': 3, 'bezoekers': 461, 'stukId': 32}, {
//     'numOptredens': 2,
//     'bezoekers': 188,
//     'stukId': 6
//   }, {'numOptredens': 2, 'bezoekers': 298, 'stukId': 13}, {'numOptredens': 2, 'bezoekers': 231, 'stukId': 24}, {
//     'numOptredens': 2,
//     'bezoekers': 200,
//     'stukId': 25
//   }, {'numOptredens': 2, 'bezoekers': 232, 'stukId': 33}, {'numOptredens': 1, 'bezoekers': 1281, 'stukId': 2}, {
//     'numOptredens': 1,
//     'bezoekers': 71,
//     'stukId': 4
//   }, {'numOptredens': 1, 'bezoekers': 114, 'stukId': 7}]
// };

