import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';

declare var window: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.statusBar.backgroundColorByHexString('#ffffff')
      this.statusBar.overlaysWebView(true);

      if (window.AndroidNotch) {
        const style = document.documentElement.style;

        window.AndroidNotch.getInsetTop(px => {
          style.setProperty('--ion-safe-area-top', px + 'px');
        }, (err) => console.error('Failed to get insets top:', err));
      }
    });
  }
}
