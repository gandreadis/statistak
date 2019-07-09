import {Component, OnInit} from '@angular/core';
import {DatabaseService, Stuk} from '../../services/database.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {

  ricciottiCharts: Stuk[] = [];
  ricciottiChartsGlobaal: Stuk[] = [];
  ricciottiChartsNL: Stuk[] = [];
  ricciottiChartsGE: Stuk[] = [];
  mode = 'globaal';

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.databaseService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseService.getOptredens().subscribe(optredens => {
          this.databaseService.getRicciottiCharts().then(data => {
            this.ricciottiChartsGlobaal = data;
            if (this.mode === 'globaal') {
              this.ricciottiCharts = this.ricciottiChartsGlobaal;
            }
          });
          this.databaseService.getRicciottiCharts('nl').then(data => {
            this.ricciottiChartsNL = data;
            if (this.mode === 'nl') {
              this.ricciottiCharts = this.ricciottiChartsNL;
            }
          });
          this.databaseService.getRicciottiCharts('ge').then(data => {
            this.ricciottiChartsGE = data;
            if (this.mode === 'ge') {
              this.ricciottiCharts = this.ricciottiChartsGE;
            }
          });
        });
      }
    });
  }

  updateCharts(event) {
    if (event.target.value === 'globaal') {
      this.ricciottiCharts = this.ricciottiChartsGlobaal;
    } else if (event.target.value === 'nl') {
      this.ricciottiCharts = this.ricciottiChartsNL;
    } else if (event.target.value === 'ge') {
      this.ricciottiCharts = this.ricciottiChartsGE;
    }
  }

}
