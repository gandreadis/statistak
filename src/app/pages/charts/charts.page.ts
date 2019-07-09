import {Component, OnInit} from '@angular/core';
import {DatabaseService, Stuk} from '../../services/database.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {

  ricciottiCharts: Stuk[] = [];

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.databaseService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseService.getOptredens().subscribe(optredens => {
          this.databaseService.getRicciottiCharts().then(data => {
            this.ricciottiCharts = data;
          });
        });
      }
    });
  }

}
