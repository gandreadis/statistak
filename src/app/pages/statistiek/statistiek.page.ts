import {Component, OnInit} from '@angular/core';
import {DatabaseService, Optreden} from '../../services/database.service';

@Component({
  selector: 'app-statistiek',
  templateUrl: './statistiek.page.html',
  styleUrls: ['./statistiek.page.scss'],
})
export class StatistiekPage implements OnInit {

  view: any[] = [300, 300];
  defaultHeight = 300;
  padding = 20;

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
  averageBuiten = 0;
  averageBuitenInNL = 0;
  averageBuitenInGE = 0;
  percentageDoelgroep = [];
  percentageSolisten = [];
  combinations: { titels: string, count: number }[] = [];

  constructor(private databaseService: DatabaseService) {
    this.view = [window.innerWidth - this.padding * 2, this.defaultHeight];

    setTimeout(() => {
      this.view = [window.innerWidth - this.padding * 2 + 1, this.defaultHeight + 1];
    }, 1000);
  }

  onResize(event) {
    this.view = [event.target.innerWidth - this.padding * 2, this.defaultHeight];
  }

  ngOnInit() {
    this.databaseService.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.databaseService.getOptredens().subscribe(async optredens => {
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
          this.databaseService.getPercentageBuitenVoorLand().then(data => {
            this.averageBuiten = data;
          });
          this.databaseService.getPercentageBuitenVoorLand('nl').then(data => {
            this.averageBuitenInNL = data;
          });
          this.databaseService.getPercentageBuitenVoorLand('ge').then(data => {
            this.averageBuitenInGE = data;
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

          this.databaseService.getPercentageSolistenVoorLand('metSolist1').then(async data => {
            const metSolist1Globaal = data;
            const metSolist1NL = await this.databaseService.getPercentageSolistenVoorLand('metSolist1', 'nl');
            const metSolist1GE = await this.databaseService.getPercentageSolistenVoorLand('metSolist1', 'ge');
            const metSolist2Globaal = await this.databaseService.getPercentageSolistenVoorLand('metSolist2');
            const metSolist2NL = await this.databaseService.getPercentageSolistenVoorLand('metSolist2', 'nl');
            const metSolist2GE = await this.databaseService.getPercentageSolistenVoorLand('metSolist2', 'ge');

            this.percentageSolisten = [
              {
                name: 'Solist 1',
                series: [
                  {
                    name: '🌍',
                    value: metSolist1Globaal,
                  },
                  {
                    name: 'nl',
                    value: metSolist1NL,
                  },
                  {
                    name: 'ge',
                    value: metSolist1GE,
                  },
                ],
              },
              {
                name: 'Solist 2',
                series: [
                  {
                    name: '🌍',
                    value: metSolist2Globaal,
                  },
                  {
                    name: 'nl',
                    value: metSolist2NL,
                  },
                  {
                    name: 'ge',
                    value: metSolist2GE,
                  },
                ],
              },
            ];
          });

          this.combinations = await this.computePopularCombinations(optredens);
        });
      }
    });
  }

  async computePopularCombinations(optredens: Optreden[]) {
    const allSets = [];
    optredens.forEach(optreden => {
      const stukIds = optreden.stukken.map(o => o.id);
      for (let i = 0; i < stukIds.length; i++) {
        for (let j = 0; j <= i; j++) {
          if (i !== j) {
            allSets.push(stukIds[i] + '_' + stukIds[j]);
          }
        }
      }
    });

    const counts = {};

    allSets.forEach((combi: string) => {
      const switched = combi.split('_').reverse().join('_');

      if (counts[combi] || counts[switched]) {
        counts[combi] += 1;
      } else {
        counts[combi] = 1;
      }
    });

    const combinations = [];
    for (const combi in counts) {
      if (counts.hasOwnProperty(combi)) {
        const stukIds = combi.split('_');
        const stuk1 = await this.databaseService.getStuk(stukIds[0]);
        const stuk2 = await this.databaseService.getStuk(stukIds[1]);

        combinations.push({
          titels: stuk1.titel + ' & ' + stuk2.titel,
          count: counts[combi],
        });
      }
    }

    combinations.sort((a, b) => b.count - a.count);

    return combinations.slice(0, 10);
  }

}
