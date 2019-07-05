import {Platform} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {HttpClient} from '@angular/common/http';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {SharedModule} from '../shared/shared.module';

export interface Optreden {
  id: number;
  locatie: string;
  plaats: string;
  landCode: string;
  longitude: number;
  latitude: number;
  datum: string;
  tijd: string;
  isBuiten: boolean;
  isSociaal: boolean;
  isOpenbaar: boolean;
  isBesloten: boolean;
  isWildOp: boolean;
  aantalBezoekers: number;
  stukken: Stuk[];
}

export interface Stuk {
  id: number;
  titel: string;
  componist: string;
  code: string;
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
    return this.database.executeSql('SELECT * FROM optreden', []).then(async data => {
      const optredens: Optreden[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const stukken = await this.getOptredenRepertoire(data.rows.item(i).id);
          stukken.sort(SharedModule.dynamicSort('code'));

          optredens.push({
            id: data.rows.item(i).id,
            locatie: data.rows.item(i).locatie,
            plaats: data.rows.item(i).plaats,
            landCode: data.rows.item(i).landCode,
            longitude: data.rows.item(i).longitude,
            latitude: data.rows.item(i).latitude,
            datum: data.rows.item(i).datum,
            tijd: data.rows.item(i).tijd,
            isBuiten: data.rows.item(i).isBuiten === 1,
            isSociaal: data.rows.item(i).isSociaal === 1,
            isOpenbaar: data.rows.item(i).isOpenbaar === 1,
            isBesloten: data.rows.item(i).isBesloten === 1,
            isWildOp: data.rows.item(i).isWildOp === 1,
            aantalBezoekers: data.rows.item(i).aantalBezoekers,
            stukken,
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
      optreden.datum,
      optreden.tijd,
      optreden.isBuiten ? 1 : 0,
      optreden.isSociaal ? 1 : 0,
      optreden.isOpenbaar ? 1 : 0,
      optreden.isBesloten ? 1 : 0,
      optreden.isWildOp ? 1 : 0,
      optreden.aantalBezoekers,
    ];
    return this.database.executeSql('INSERT INTO optreden (locatie, plaats, landCode, longitude, latitude, datum, tijd, ' +
      'isBuiten, isSociaal, isOpenbaar, isBesloten, isWildOp, aantalBezoekers) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data).then(async () => {

      if (optreden.stukken.length > 0) {
        const stukString = optreden.stukken.map(stuk => `(${optreden.id}, ${stuk.id})`).join(', ');

        await this.database.executeSql(`INSERT INTO optreden_repertoire (optredenId, stukId) VALUES ${stukString}`);
      }
      this.loadOptredens();
    });
  }

  getOptreden(id): Promise<Optreden> {
    return this.database.executeSql('SELECT * FROM optreden WHERE id = ?', [id]).then(async data => {
      const stukken = await this.getOptredenRepertoire(data.rows.item(0).id);
      stukken.sort(SharedModule.dynamicSort('code'));

      return {
        id: data.rows.item(0).id,
        locatie: data.rows.item(0).locatie,
        plaats: data.rows.item(0).plaats,
        landCode: data.rows.item(0).landCode,
        longitude: data.rows.item(0).longitude,
        latitude: data.rows.item(0).latitude,
        datum: data.rows.item(0).datum,
        tijd: data.rows.item(0).tijd,
        isBuiten: data.rows.item(0).isBuiten === 1,
        isSociaal: data.rows.item(0).isSociaal === 1,
        isOpenbaar: data.rows.item(0).isOpenbaar === 1,
        isBesloten: data.rows.item(0).isBesloten === 1,
        isWildOp: data.rows.item(0).isWildOp === 1,
        aantalBezoekers: data.rows.item(0).aantalBezoekers,
        stukken,
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
      optreden.datum,
      optreden.tijd,
      optreden.isBuiten ? 1 : 0,
      optreden.isSociaal ? 1 : 0,
      optreden.isOpenbaar ? 1 : 0,
      optreden.isBesloten ? 1 : 0,
      optreden.isWildOp ? 1 : 0,
      optreden.aantalBezoekers,
    ];
    return this.database.executeSql(`
    UPDATE optreden SET locatie = ?, plaats = ?, landCode = ?, longitude = ?, latitude = ?, datum = ?, tijd = ?,
      isBuiten = ?, isSociaal = ?, isOpenbaar = ?, isBesloten = ?, isWildOp = ?, aantalBezoekers = ?
      WHERE id = ${optreden.id}`, data).then(async () => {
      if (optreden.stukken.length > 0) {
        const stukString = optreden.stukken.map(stuk => `(${optreden.id}, ${stuk.id})`).join(', ');

        try {
          await this.database.executeSql(`DELETE FROM optreden_repertoire WHERE optredenId=${optreden.id}`);
        } catch (e) {
          if (!e.hasOwnProperty('rows')) {
            console.error(e);
          }
        }

        try {
          await this.database.executeSql(`INSERT INTO optreden_repertoire (optredenId, stukId) VALUES ${stukString}`);
        } catch (e) {
          if (!e.hasOwnProperty('rows')) {
            console.error(e);
          }
        }

      }
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
            componist: data.rows.item(i).componist,
            code: data.rows.item(i).code,
          });
        }
      }

      stukken.sort(SharedModule.dynamicSort('code'));

      this.stukken.next(stukken);
    });
  }

  addStuk(stuk: Stuk) {
    const data = [
      stuk.titel,
      stuk.componist,
      stuk.code,
    ];
    return this.database.executeSql('INSERT INTO stuk (titel, componist, code) VALUES (?, ?, ?)', data).then(() => {
      this.loadStukken();
    });
  }

  getStuk(id): Promise<Stuk> {
    return this.database.executeSql('SELECT * FROM stuk WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        titel: data.rows.item(0).titel,
        componist: data.rows.item(0).componist,
        code: data.rows.item(0).code,
      };
    });
  }

  getOptredenRepertoire(optredenId): Promise<Stuk[]> {
    return this.database.executeSql(`
    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id
    WHERE optreden_repertoire.optredenId = ?`, [optredenId]).then(data => {
      const stukken: Stuk[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          stukken.push({
            id: data.rows.item(i).id,
            titel: data.rows.item(i).titel,
            componist: data.rows.item(i).componist,
            code: data.rows.item(i).code,
          });
        }
      }

      stukken.sort(SharedModule.dynamicSort('code'));

      return stukken;
    });
  }

  deleteStuk(id) {
    return this.database.executeSql('DELETE FROM stuk WHERE id = ?', [id]).then(_ => {
      this.loadStukken();
      this.loadOptredens();
    });
  }

  updateStuk(stuk: Stuk) {
    const data = [
      stuk.titel,
      stuk.componist,
      stuk.code,
    ];
    return this.database.executeSql(`UPDATE stuk SET titel = ?, componist = ?, code = ? WHERE id = ${stuk.id}`, data).then(() => {
      this.loadStukken();
      this.loadOptredens();
    });
  }
}
