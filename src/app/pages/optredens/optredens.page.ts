import {DatabaseService, Optreden} from '../../services/database.service';
import {Component, OnInit} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';

@Component({
  selector: 'app-optredens',
  templateUrl: './optredens.page.html',
  styleUrls: ['./optredens.page.scss'],
})
export class OptredensPage implements OnInit {

  optredensPerDag: {
    datum: string,
    optredens: Optreden[],
  }[] = [];

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getOptredens().subscribe(optredens => {
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
        });
      }
    });
  }

}
