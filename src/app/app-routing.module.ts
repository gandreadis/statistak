import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
  {path: 'charts', loadChildren: './pages/charts/charts.module#ChartsPageModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
