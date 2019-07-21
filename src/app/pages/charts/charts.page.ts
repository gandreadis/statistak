import {Component, OnInit} from '@angular/core';
import {DatabaseService, Stuk} from '../../services/database.service';
import {SharedModule} from '../../shared/shared.module';

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
  sortBy = 'optredens';

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
              this.sortByCountType(this.sortBy);
            }
          });
          this.databaseService.getRicciottiCharts('nl').then(data => {
            this.ricciottiChartsNL = data;
            if (this.mode === 'nl') {
              this.ricciottiCharts = this.ricciottiChartsNL;
              this.sortByCountType(this.sortBy);
            }
          });
          this.databaseService.getRicciottiCharts('ge').then(data => {
            this.ricciottiChartsGE = data;
            if (this.mode === 'ge') {
              this.ricciottiCharts = this.ricciottiChartsGE;
              this.sortByCountType(this.sortBy);
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
    this.sortByCountType(this.sortBy);
    this.mode = event.target.value;
  }

  sortByCountType(type) {
    this.ricciottiCharts.sort(SharedModule.dynamicSort('-' + type));
    this.ricciottiCharts = [...this.ricciottiCharts];
  }

  sortCharts(event) {
    if (event.target.value === 'optredens') {
      this.sortByCountType('optredens');
    } else if (event.target.value === 'bezoekers') {
      this.sortByCountType('bezoekers');
    }
    this.sortBy = event.target.value;
  }
}
