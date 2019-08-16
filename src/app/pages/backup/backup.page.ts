import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Clipboard} from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {

  constructor(private databaseService: DatabaseService, private socialSharing: SocialSharing, private clipboard: Clipboard) {
  }

  ngOnInit() {
  }

  importDB() {
    this.clipboard.paste().then(sql => this.databaseService.importDatabase(sql));
  }

  exportDB() {
    this.databaseService.exportDatabase().then(sql => this.socialSharing.share(sql));
  }

  exportCache() {
    this.socialSharing.share(JSON.stringify(this.databaseService.getCache()));
  }

  resetDB() {
    this.databaseService.resetDatabase(() => this.databaseService.seedDatabase());
  }

}
