import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {BackupPage} from './backup.page';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Clipboard} from '@ionic-native/clipboard/ngx';

const routes: Routes = [
  {
    path: '',
    component: BackupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    SocialSharing,
    Clipboard,
  ],
  declarations: [BackupPage]
})
export class BackupPageModule {
}
