import {Platform} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {SharedModule} from '../shared/shared.module';
import {SQLDatabase} from './sqlite';
import {SQLitePorter} from '@ionic-native/sqlite-porter/ngx';
import {SQLite} from '@ionic-native/sqlite/ngx';

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
  mansen: boolean;
  cds: boolean;
  groupies: boolean;
  aantalBezoekers: number;
  gastdirigent: string;
  opmerkingen: string;
  stukken: Stuk[];
}

export interface Stuk {
  id: number;
  titel: string;
  componist: string;
  code: string;
  metSolist1: boolean;
  metSolist2: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sql: SQLDatabase;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  optredens = new BehaviorSubject([]);
  stukken = new BehaviorSubject([]);

  constructor(private plt: Platform, private http: HttpClient, private sqlitePorter: SQLitePorter, private sqlite: SQLite) {
    this.plt.ready().then(() => {
      this.sql = new SQLDatabase(sqlitePorter, sqlite);
      this.sql.init().then(() => {
        // this.resetDatabase(() => this.seedDatabase());
        this.seedDatabase();
      });
    });
  }

  resetDatabase(cb) {
    this.http.get('assets/db/reset.sql', {responseType: 'text'})
      .subscribe(sql => {
        this.sql.import(sql)
          .then(cb)
          .catch(e => console.error(e));
      });
  }

  seedDatabase() {
    this.http.get('assets/db/seed.sql', {responseType: 'text'})
      .subscribe(sql => {
        this.sql.import(sql)
          .then(_ => {
            this.loadOptredens();
            this.loadStukken();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  importDatabase(sql) {
    return this.sql.import(sql).finally(() => {
      this.loadOptredens();
      this.loadStukken();
    });
  }

  exportDatabase() {
    return this.sql.export();
  }

  getCache() {
    return this.sql.cache;
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
    return this.sql.exec('SELECT * FROM optreden').then(async data => {
      const optredens: Optreden[] = [];

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          const stukken = await this.getOptredenRepertoire(data[i].id);
          stukken.sort(SharedModule.dynamicSort('code'));

          optredens.push({
            id: data[i].id,
            locatie: data[i].locatie,
            plaats: data[i].plaats,
            landCode: data[i].landCode,
            longitude: data[i].longitude,
            latitude: data[i].latitude,
            datum: data[i].datum,
            tijd: data[i].tijd,
            isBuiten: data[i].isBuiten === 1,
            isSociaal: data[i].isSociaal === 1,
            isOpenbaar: data[i].isOpenbaar === 1,
            isBesloten: data[i].isBesloten === 1,
            isWildOp: data[i].isWildOp === 1,
            mansen: data[i].mansen === 1,
            cds: data[i].cds === 1,
            groupies: data[i].groupies === 1,
            aantalBezoekers: data[i].aantalBezoekers,
            gastdirigent: data[i].gastdirigent,
            opmerkingen: data[i].opmerkingen,
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
      optreden.mansen ? 1 : 0,
      optreden.cds ? 1 : 0,
      optreden.groupies ? 1 : 0,
      optreden.aantalBezoekers,
      optreden.gastdirigent,
      optreden.opmerkingen,
    ];
    return this.sql.execWithVars(`
    INSERT INTO optreden (locatie, plaats, landCode, longitude, latitude, datum, tijd, isBuiten,
    isSociaal, isOpenbaar, isBesloten, isWildOp, mansen, cds, groupies, aantalBezoekers, gastdirigent, opmerkingen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, data).then(async () => {

      let optredenIdResponse = await this.sql.exec(`SELECT seq FROM sqlite_sequence WHERE name='optreden'`);

      const optredenId = optredenIdResponse[0].seq;
      if (optreden.stukken.length > 0) {
        const stukString = optreden.stukken.map(stuk => `(${optredenId}, ${stuk.id})`).join(', ');
        await this.sql.run(`INSERT INTO optreden_repertoire (optredenId, stukId) VALUES ${stukString}`);
      }
      this.loadOptredens();
    });
  }

  getOptreden(id): Promise<Optreden> {
    return this.sql.exec(`SELECT * FROM optreden WHERE id = '${id}'`).then(async data => {
      const stukken = await this.getOptredenRepertoire(data[0].id);
      stukken.sort(SharedModule.dynamicSort('code'));

      return {
        id: data[0].id,
        locatie: data[0].locatie,
        plaats: data[0].plaats,
        landCode: data[0].landCode,
        longitude: data[0].longitude,
        latitude: data[0].latitude,
        datum: data[0].datum,
        tijd: data[0].tijd,
        isBuiten: data[0].isBuiten === 1,
        isSociaal: data[0].isSociaal === 1,
        isOpenbaar: data[0].isOpenbaar === 1,
        isBesloten: data[0].isBesloten === 1,
        isWildOp: data[0].isWildOp === 1,
        mansen: data[0].mansen === 1,
        cds: data[0].cds === 1,
        groupies: data[0].groupies === 1,
        aantalBezoekers: data[0].aantalBezoekers,
        gastdirigent: data[0].gastdirigent,
        opmerkingen: data[0].opmerkingen,
        stukken,
      };
    });
  }

  deleteOptreden(id) {
    return this.sql.run(`DELETE FROM optreden WHERE id = '${id}'`).then(_ => {
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
      optreden.mansen ? 1 : 0,
      optreden.cds ? 1 : 0,
      optreden.groupies ? 1 : 0,
      optreden.aantalBezoekers,
      optreden.gastdirigent,
      optreden.opmerkingen,
    ];
    return this.sql.execWithVars(`
    UPDATE optreden SET locatie = ?, plaats = ?, landCode = ?, longitude = ?, latitude = ?, datum = ?, tijd = ?,
      isBuiten = ?, isSociaal = ?, isOpenbaar = ?, isBesloten = ?, isWildOp = ?, mansen = ?, cds = ?, groupies = ?, aantalBezoekers = ?, gastdirigent = ?, opmerkingen = ?
      WHERE id = ${optreden.id}`, data).then(async () => {
      if (optreden.stukken.length > 0) {
        const stukString = optreden.stukken.map(stuk => `(${optreden.id}, ${stuk.id})`).join(', ');

        await this.sql.run(`DELETE FROM optreden_repertoire WHERE optredenId=${optreden.id}`);
        await this.sql.run(`INSERT INTO optreden_repertoire (optredenId, stukId) VALUES ${stukString}`);

      }
      this.loadOptredens();
    });
  }

  loadStukken() {
    return this.sql.exec('SELECT * FROM stuk').then(data => {
      const stukken: Stuk[] = [];

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          stukken.push({
            id: data[i].id,
            titel: data[i].titel,
            componist: data[i].componist,
            code: data[i].code,
            metSolist1: data[i].metSolist1 === 1,
            metSolist2: data[i].metSolist2 === 1,
          });
        }
      }

      stukken.sort(SharedModule.dynamicSort('code'));

      this.stukken.next(stukken);
    }).catch(err => console.error('yoyo', err));
  }

  addStuk(stuk: Stuk) {
    const data = [
      stuk.titel,
      stuk.componist,
      stuk.code,
      stuk.metSolist1 ? 1 : 0,
      stuk.metSolist2 ? 1 : 0,
    ];
    return this.sql.execWithVars(`
    INSERT INTO stuk (titel, componist, code, metSolist1, metSolist2)
    VALUES (?, ?, ?, ?, ?)`, data).then(() => {
      this.loadStukken();
    });
  }

  getStuk(id): Promise<Stuk> {
    return this.sql.exec(`SELECT * FROM stuk WHERE id = '${id}'`).then(data => {
      return {
        id: data[0].id,
        titel: data[0].titel,
        componist: data[0].componist,
        code: data[0].code,
        metSolist1: data[0].metSolist1 === 1,
        metSolist2: data[0].metSolist2 === 1,
      };
    });
  }

  getOptredenRepertoire(optredenId): Promise<Stuk[]> {
    return this.sql.exec(`
    SELECT * FROM optreden_repertoire JOIN stuk ON optreden_repertoire.stukId = stuk.id
    WHERE optreden_repertoire.optredenId = '${optredenId}'`).then(data => {
      const stukken: Stuk[] = [];

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          stukken.push({
            id: data[i].id,
            titel: data[i].titel,
            componist: data[i].componist,
            code: data[i].code,
            metSolist1: data[i].metSolist1 === 1,
            metSolist2: data[i].metSolist2 === 1,
          });
        }
      }

      stukken.sort(SharedModule.dynamicSort('code'));

      return stukken;
    });
  }

  deleteStuk(id) {
    return this.sql.run(`DELETE FROM stuk WHERE id = '${id}'`).then(_ => {
      this.loadStukken();
      this.loadOptredens();
    });
  }

  updateStuk(stuk: Stuk) {
    const data = [
      stuk.titel,
      stuk.componist,
      stuk.code,
      stuk.metSolist1 ? 1 : 0,
      stuk.metSolist2 ? 1 : 0,
    ];
    return this.sql.execWithVars(`UPDATE stuk SET titel = ?, componist = ?, code = ?, metSolist1 = ?, metSolist2 = ?
    WHERE id = ${stuk.id}`, data).then(() => {
      this.loadStukken();
      this.loadOptredens();
    });
  }

  getNumOptredensPerDag() {
    return this.sql.exec(`SELECT count(*) AS numOptredens, datum FROM optreden GROUP BY datum`).then(data => {
      const dagen = [];
      for (let i = 0; i < data.length; i++) {
        dagen.push({
          name: new Date(data[i].datum),
          value: data[i].numOptredens,
        });
      }
      return dagen;
    });
  }

  getAverageOptredensPerDagVoorLand(landCode) {
    return this.sql.exec(`
    SELECT avg(numOptredens) AS avgNumOptredens FROM
    (SELECT count(*) AS numOptredens FROM optreden
    WHERE landCode = '${landCode}' GROUP BY datum)`)
      .then(data => {
        const avg = data[0].avgNumOptredens;

        return avg === null ? 0 : avg;
      });
  }

  getNumOptredensVoorLand(landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT count(*) AS numOptredens FROM optreden ${where}`)
      .then(data => {
        const num = data[0].numOptredens;

        return num === null ? 0 : num;
      });
  }

  getPubliekVoorLand(landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT sum(aantalBezoekers) AS aantalBezoekers FROM optreden ${where}`)
      .then(data => {
        const num = data[0].aantalBezoekers;

        return num === null ? 0 : num;
      });
  }

  getPercentageWildopVoorLand(landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT AVG(isWildOp) AS percentage FROM optreden ${where}`)
      .then(data => {
        const percentage = data[0].percentage;

        return percentage === null ? 0 : percentage;
      });
  }

  getPercentageBuitenVoorLand(landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT AVG(isBuiten) AS percentage FROM optreden ${where}`)
      .then(data => {
        const percentage = data[0].percentage;

        return percentage === null ? 0 : percentage;
      });
  }

  getPercentageDoelgroepVoorLand(doelgroep, landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT AVG(${doelgroep}) AS percentage FROM optreden ${where}`)
      .then(data => {
        const percentage = data[0].percentage;

        return percentage === null ? 0 : percentage;
      });
  }

  getPercentageSolistenVoorLand(solist, landCode?) {
    const where = landCode ? `WHERE optreden.landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT AVG(solist) AS percentage FROM
    (SELECT MAX(stuk.${solist}) AS solist FROM optreden_repertoire
    JOIN optreden ON optreden.id = optredenId
    JOIN stuk ON stuk.id = stukId
    ${where}
    GROUP BY optredenId)`)
      .then(data => {
        const percentage = data[0].percentage;

        return percentage === null ? 0 : percentage;
      });
  }

  getAverageOptredensPerDag() {
    return this.getNumOptredensPerDag().then(data => {
      const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;

      return average(data.map(o => o.value));
    });
  }

  getRicciottiCharts(landCode?) {
    const where = landCode ? `WHERE landCode = '${landCode}'` : '';

    return this.sql.exec(`
    SELECT count(*) AS numOptredens, sum(aantalBezoekers) AS bezoekers, stukId FROM 
    (SELECT stukId, optreden.aantalBezoekers AS aantalBezoekers FROM optreden_repertoire
    JOIN stuk ON stuk.id = stukId
    JOIN optreden ON optreden.id = optredenId ${where})
    GROUP BY stukId ORDER BY numOptredens DESC`).then(async data => {
      const stukken = [];
      for (let i = 0; i < data.length; i++) {
        const stuk = await this.getStuk(data[i].stukId);
        stukken.push(Object.assign(stuk, {
          optredens: data[i].numOptredens,
          bezoekers: data[i].bezoekers,
        }));
      }
      return stukken;
    });
  }
}
