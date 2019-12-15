import {DatabaseService, Optreden} from '../../services/database.service';
import {Component, OnInit} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';
import {utils, WorkBook, WorkSheet, writeFile} from 'xlsx';

@Component({
  selector: 'app-optredens',
  templateUrl: './optredens.page.html',
  styleUrls: ['./optredens.page.scss'],
})
export class OptredensPage implements OnInit {
  env = environment;

  optredensPerDag: {
    datum: string,
    optredens: Optreden[],
  }[] = [];
  optredens: Optreden[] = [];

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getOptredens().subscribe(optredens => {
          this.optredens = optredens;
          const datumNaarOptredens = {};
          optredens.forEach(optreden => {
            if (datumNaarOptredens.hasOwnProperty(optreden.datum)) {
              datumNaarOptredens[optreden.datum].push(optreden);
            } else {
              datumNaarOptredens[optreden.datum] = [optreden];
            }
          });

          this.optredensPerDag = [];

          for (const datum in datumNaarOptredens) {
            if (datumNaarOptredens.hasOwnProperty(datum)) {
              datumNaarOptredens[datum].sort(SharedModule.dynamicSort('tijd'));
              this.optredensPerDag.push({
                datum, optredens: datumNaarOptredens[datum]
              });
            }
          }

          this.optredensPerDag.sort(SharedModule.dynamicSort('datum'));

          const data = [];

          this.optredens.forEach((optreden, i) => {
            const row = [];
            row.push(
              i + 1,
              optreden.datum,
              optreden.tijd,
              '?',
              optreden.locatie,
              optreden.plaats,
              '',
              '',
              '',
              (optreden.isBesloten ? 'SB' : (
                optreden.isOpenbaar && optreden.isSociaal ? 'SO' : (
                  optreden.isOpenbaar ? 'O' : (
                    optreden.isWildOp ? 'WO' : ''
                  )
                )
              )),
              '',
              optreden.aantalBezoekers,
              optreden.gastdirigent,
              '',
            );
            optreden.stukken.map(stuk => stuk.code).forEach(stuk => row.push(stuk));
            while (row.length < 37) {
              row.push('');
            }
            row.push(
              optreden.mansen,
              optreden.cds,
              optreden.groupies,
            );
            data.push(row);
          });

          const ws: WorkSheet = utils.aoa_to_sheet(data);

          /* generate workbook and add the worksheet */
          const wb: WorkBook = utils.book_new();
          utils.book_append_sheet(wb, ws, 'Sheet1');

          /* save to file */
          writeFile(wb, 'SheetJS.xlsx');
        });
      }
    });
  }

  formatDatum(datum) {
    return moment(datum).format('MMMM Do');
  }

}
