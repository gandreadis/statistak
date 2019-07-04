import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
  {path: 'repertoire', loadChildren: './pages/repertoire/repertoire.module#RepertoirePageModule'},
  {path: 'optredens', loadChildren: './pages/optredens/optredens.module#OptredensPageModule'},
  {path: 'optreden', loadChildren: './pages/optreden/optreden.module#OptredenPageModule'},
  {path: 'stuk', loadChildren: './pages/stuk/stuk.module#StukPageModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
