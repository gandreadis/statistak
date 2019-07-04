import {Platform} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {HttpClient} from '@angular/common/http';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Optreden {
  id: number;
  locatie: string;
  plaats: string;
  landCode: string;
  longitude: number;
  latitude: number;
  isBuiten: boolean;
  isSociaal: boolean;
  isOpenbaar: boolean;
  isBesloten: boolean;
  isWildOp: boolean;
  aantalBezoekers: number;
}

export interface Stuk {
  id: number;
  titel: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  optredens = new BehaviorSubject([]);
  stukken = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'statistak.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http.get('assets/seed.sql', {responseType: 'text'})
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadOptredens();
            this.loadStukken();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getOptredens(): Observable<Optreden[]> {
    return this.optredens.asObservable();
  }

  getStukken(): Observable<Stuk[]> {
    return this.stukken.asObservable();
  }

  loadOptredens() {
    return this.database.executeSql('SELECT * FROM optreden', []).then(data => {
      const optredens: Optreden[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          optredens.push({
            id: data.rows.item(i).id,
            locatie: data.rows.item(i).locatie,
            plaats: data.rows.item(i).plaats,
            landCode: data.rows.item(i).landCode,
            longitude: data.rows.item(i).longitude,
            latitude: data.rows.item(i).latitude,
            isBuiten: data.rows.item(i).isBuiten === 1,
            isSociaal: data.rows.item(i).isSociaal === 1,
            isOpenbaar: data.rows.item(i).isOpenbaar === 1,
            isBesloten: data.rows.item(i).isBesloten === 1,
            isWildOp: data.rows.item(i).isWildOp === 1,
            aantalBezoekers: data.rows.item(i).aantalBezoekers,
          });
        }
      }

      this.optredens.next(optredens);
    });
  }

  addOptreden(optreden: Optreden) {
    const data = [
      optreden.locatie,
      optreden.plaats,
      optreden.landCode,
      optreden.longitude,
      optreden.latitude,
      optreden.isBuiten ? 1 : 0,
      optreden.isSociaal ? 1 : 0,
      optreden.isOpenbaar ? 1 : 0,
      optreden.isBesloten ? 1 : 0,
      optreden.isWildOp ? 1 : 0,
      optreden.aantalBezoekers,
    ];
    return this.database.executeSql('INSERT INTO optreden (locatie, plaats, landCode, longitude, latitude, ' +
      'isBuiten, isSociaal, isOpenbaar, isBesloten, isWildOp, aantalBezoekers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(() => {
      this.loadOptredens();
    });
  }

  getOptreden(id): Promise<Optreden> {
    return this.database.executeSql('SELECT * FROM optreden WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        locatie: data.rows.item(0).locatie,
        plaats: data.rows.item(0).plaats,
        landCode: data.rows.item(0).landCode,
        longitude: data.rows.item(0).longitude,
        latitude: data.rows.item(0).latitude,
        isBuiten: data.rows.item(0).isBuiten === 1,
        isSociaal: data.rows.item(0).isSociaal === 1,
        isOpenbaar: data.rows.item(0).isOpenbaar === 1,
        isBesloten: data.rows.item(0).isBesloten === 1,
        isWildOp: data.rows.item(0).isWildOp === 1,
        aantalBezoekers: data.rows.item(0).aantalBezoekers,
      };
    });
  }

  deleteOptreden(id) {
    return this.database.executeSql('DELETE FROM optreden WHERE id = ?', [id]).then(_ => {
      this.loadOptredens();
    });
  }

  updateOptreden(optreden: Optreden) {
    const data = [
      optreden.locatie,
      optreden.plaats,
      optreden.landCode,
      optreden.longitude,
      optreden.latitude,
      optreden.isBuiten ? 1 : 0,
      optreden.isSociaal ? 1 : 0,
      optreden.isOpenbaar ? 1 : 0,
      optreden.isBesloten ? 1 : 0,
      optreden.isWildOp ? 1 : 0,
      optreden.aantalBezoekers,
    ];
    return this.database.executeSql(`
    UPDATE optreden SET locatie = ?, plaats = ?, landCode = ?, longitude = ?, latitude = ?,
      isBuiten = ?, isSociaal = ?, isOpenbaar = ?, isBesloten = ?, isWildOp = ?, aantalBezoekers = ?
      WHERE id = ${optreden.id}`, data).then(() => {
      this.loadOptredens();
    });
  }

  loadStukken() {
    return this.database.executeSql('SELECT * FROM stuk', []).then(data => {
      const stukken: Stuk[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          stukken.push({
            id: data.rows.item(i).id,
            titel: data.rows.item(i).titel,
          });
        }
      }

      this.stukken.next(stukken);
    });
  }

  addStuk(titel) {
    const data = [titel];
    return this.database.executeSql('INSERT INTO stuk (locatie) VALUES (?)', data).then(() => {
      this.loadStukken();
    });
  }

  getStuk(id): Promise<Stuk> {
    return this.database.executeSql('SELECT * FROM stuk WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        titel: data.rows.item(0).titel,
      };
    });
  }

  deleteStuk(id) {
    return this.database.executeSql('DELETE FROM stuk WHERE id = ?', [id]).then(_ => {
      this.loadStukken();
    });
  }

  updateStuk(stuk: Stuk) {
    const data = [stuk.titel];
    return this.database.executeSql(`UPDATE stuk SET titel = ? WHERE id = ${stuk.id}`, data).then(() => {
      this.loadStukken();
    });
  }
}
