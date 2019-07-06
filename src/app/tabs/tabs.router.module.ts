import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'optredens',
        children: [
          {
            path: '',
            loadChildren: '../pages/optredens/optredens.module#OptredensPageModule'
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                loadChildren: '../pages/optreden/optreden.module#OptredenPageModule'
              }
            ]
          },
        ]
      },
      {
        path: 'repertoire',
        children: [
          {
            path: '',
            loadChildren: '../pages/repertoire/repertoire.module#RepertoirePageModule'
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                loadChildren: '../pages/stuk/stuk.module#StukPageModule'
              }
            ]
          },
        ]
      },
      {
        path: 'statistiek',
        children: [
          {
            path: '',
            loadChildren: '../pages/statistiek/statistiek.module#StatistiekPageModule'
          },
        ]
      },
      {
        path: 'backup',
        children: [
          {
            path: '',
            loadChildren: '../pages/backup/backup.module#BackupPageModule'
          },
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/optredens',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/optredens',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
