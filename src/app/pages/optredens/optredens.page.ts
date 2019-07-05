import {DatabaseService, Optreden} from '../../services/database.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-optredens',
  templateUrl: './optredens.page.html',
  styleUrls: ['./optredens.page.scss'],
})
export class OptredensPage implements OnInit {

  optredensPerDag: Record<string, Optreden[]> = {};

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getOptredens().subscribe(optredens => {
          this.optredensPerDag = {};
          optredens.forEach(optreden => {
            if (this.optredensPerDag.hasOwnProperty(optreden.datum)) {
              this.optredensPerDag[optreden.datum].push(optreden);
            } else {
              this.optredensPerDag[optreden.datum] = [optreden];
            }
          });
          for (const datum in this.optredensPerDag) {
            if (this.optredensPerDag.hasOwnProperty(datum)) {
              this.optredensPerDag[datum].sort(dynamicSort('tijd'));
            }
          }
        });
      }
    });
  }

}
