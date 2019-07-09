import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-statistiek',
  templateUrl: './statistiek.page.html',
  styleUrls: ['./statistiek.page.scss'],
})
export class StatistiekPage implements OnInit {

  numOptredensPerDag: any[] = [];
  numOptredens = 0;
  numOptredensInNL = 0;
  numOptredensInGE = 0;
  averageNumOptredens = 0;
  averageNumOptredensInNL = 0;
  averageNumOptredensInGE = 0;
  publiek = 0;
  publiekInNL = 0;
  publiekInGE = 0;
  averageWildop = 0;
  averageWildopInNL = 0;
  averageWildopInGE = 0;
  percentageDoelgroep = [];

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.databaseService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseService.getOptredens().subscribe(optredens => {
          this.databaseService.getNumOptredensPerDag().then(data => {
            this.numOptredensPerDag = data;
          });
          this.databaseService.getAverageOptredensPerDag().then(data => {
            this.averageNumOptredens = data;
          });
          this.databaseService.getNumOptredensVoorLand().then(data => {
            this.numOptredens = data;
          });
          this.databaseService.getNumOptredensVoorLand('nl').then(data => {
            this.numOptredensInNL = data;
          });
          this.databaseService.getNumOptredensVoorLand('ge').then(data => {
            this.numOptredensInGE = data;
          });
          this.databaseService.getPubliekVoorLand().then(data => {
            this.publiek = data;
          });
          this.databaseService.getPubliekVoorLand('nl').then(data => {
            this.publiekInNL = data;
          });
          this.databaseService.getPubliekVoorLand('ge').then(data => {
            this.publiekInGE = data;
          });
          this.databaseService.getPercentageWildopVoorLand().then(data => {
            this.averageWildop = data;
          });
          this.databaseService.getPercentageWildopVoorLand('nl').then(data => {
            this.averageWildopInNL = data;
          });
          this.databaseService.getPercentageWildopVoorLand('ge').then(data => {
            this.averageWildopInGE = data;
          });
          this.databaseService.getAverageOptredensPerDagVoorLand('nl').then(data => {
            this.averageNumOptredensInNL = data;
          });
          this.databaseService.getAverageOptredensPerDagVoorLand('ge').then(data => {
            this.averageNumOptredensInGE = data;
          });

          this.databaseService.getPercentageDoelgroepVoorLand('isSociaal').then(async data => {
            const isSociaalGlobaal = data;
            const isSociaalNL = await this.databaseService.getPercentageDoelgroepVoorLand('isSociaal', 'nl');
            const isSociaalGE = await this.databaseService.getPercentageDoelgroepVoorLand('isSociaal', 'ge');
            const isOpenbaarGlobaal = await this.databaseService.getPercentageDoelgroepVoorLand('isOpenbaar');
            const isOpenbaarNL = await this.databaseService.getPercentageDoelgroepVoorLand('isOpenbaar', 'nl');
            const isOpenbaarGE = await this.databaseService.getPercentageDoelgroepVoorLand('isOpenbaar', 'ge');
            const isBeslotenGlobaal = await this.databaseService.getPercentageDoelgroepVoorLand('isBesloten');
            const isBeslotenNL = await this.databaseService.getPercentageDoelgroepVoorLand('isBesloten', 'nl');
            const isBeslotenGE = await this.databaseService.getPercentageDoelgroepVoorLand('isBesloten', 'ge');

            this.percentageDoelgroep = [
              {
                name: 'Sociaal',
                series: [
                  {
                    name: '🌍',
                    value: isSociaalGlobaal,
                  },
                  {
                    name: 'nl',
                    value: isSociaalNL,
                  },
                  {
                    name: 'ge',
                    value: isSociaalGE,
                  },
                ],
              },
              {
                name: 'Openbaar',
                series: [
                  {
                    name: '🌍',
                    value: isOpenbaarGlobaal,
                  },
                  {
                    name: 'nl',
                    value: isOpenbaarNL,
                  },
                  {
                    name: 'ge',
                    value: isOpenbaarGE,
                  },
                ],
              },
              {
                name: 'Besloten',
                series: [
                  {
                    name: '🌍',
                    value: isBeslotenGlobaal,
                  },
                  {
                    name: 'nl',
                    value: isBeslotenNL,
                  },
                  {
                    name: 'ge',
                    value: isBeslotenGE,
                  },
                ],
              },
            ];
          });
        });
      }
    });
  }

}
