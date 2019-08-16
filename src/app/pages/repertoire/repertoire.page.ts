import {Component, OnInit} from '@angular/core';
import {DatabaseService, Stuk} from '../../services/database.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-repertoire',
  templateUrl: './repertoire.page.html',
  styleUrls: ['./repertoire.page.scss'],
})
export class RepertoirePage implements OnInit {
  env = environment;
  stukken: Stuk[] = [];

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getStukken().subscribe(stukken => {
          this.stukken = stukken;
        });
      }
    });
  }

}
