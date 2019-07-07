import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-statistiek',
  templateUrl: './statistiek.page.html',
  styleUrls: ['./statistiek.page.scss'],
})
export class StatistiekPage implements OnInit {

  view: any[] = [300, 200];
  defaultHeight = 200;
  padding = 10;

  numOptredens: any[] = [];
  averageNumOptredens = 0;

  constructor(private databaseService: DatabaseService) {
    this.view = [innerWidth - this.padding * 2, this.defaultHeight];
  }

  onResize(event) {
    this.view = [event.target.innerWidth - this.padding * 2, this.defaultHeight];
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
        });
      }
    });
  }

}
