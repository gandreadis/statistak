import {Component, OnInit} from '@angular/core';
import {DatabaseService, Stuk} from '../../services/database.service';

@Component({
  selector: 'app-statistiek',
  templateUrl: './statistiek.page.html',
  styleUrls: ['./statistiek.page.scss'],
})
export class StatistiekPage implements OnInit {

  numOptredens: any[] = [];
  averageNumOptredens = 0;
  averageNumOptredensInNL = 0;
  averageNumOptredensInGE = 0;
  ricciottiCharts: Stuk[] = [];

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.databaseService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseService.getOptredens().subscribe(optredens => {
          this.databaseService.getNumOptredensPerDag().then(data => {
            this.numOptredens = data;
          });
          this.databaseService.getAverageOptredensPerDag().then(data => {
            this.averageNumOptredens = data;
          });
          this.databaseService.getAverageOptredensPerDagVoorLand('nl').then(data => {
            this.averageNumOptredensInNL = data;
          });
          this.databaseService.getAverageOptredensPerDagVoorLand('ge').then(data => {
            this.averageNumOptredensInGE = data;
          });
          this.databaseService.getRicciottiCharts().then(data => {
            this.ricciottiCharts = data;
          });
        });
      }
    });
  }

}
