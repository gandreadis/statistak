import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {StatistiekPage} from './statistiek.page';
import {NgxChartsModule} from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: StatistiekPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxChartsModule,
  ],
  declarations: [StatistiekPage]
})
export class StatistiekPageModule {
}
