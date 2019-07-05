import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService, Stuk} from '../../services/database.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-stuk',
  templateUrl: './stuk.page.html',
  styleUrls: ['./stuk.page.scss'],
})
export class StukPage implements OnInit {

  stuk: Stuk = null;

  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router, private toast: ToastController) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.route.paramMap.subscribe(params => {
          const stukId = params.get('id');

          if (stukId === '-1') {
            this.stuk = {
              id: -1,
              titel: '',
              componist: '',
              code: '',
            };
            return;
          }
          this.db.getStuk(stukId).then(data => {
            this.stuk = data;
          });
        });
      }
    });
  }

  delete() {
    if (this.stuk !== null && this.stuk.id === -1) {
      this.router.navigateByUrl('/tabs/repertoire');
      return;
    }

    this.db.deleteStuk(this.stuk.id).then(() => {
      this.router.navigateByUrl('/tabs/repertoire');
    });
  }

  update() {
    if (this.stuk !== null && this.stuk.id === -1) {
      this.db.addStuk(this.stuk).then(async (res) => {
        const toast = await this.toast.create({
          message: 'Stuk aangemaakt',
          duration: 1000
        });
        toast.present();
        this.router.navigateByUrl('/tabs/repertoire');
      });
      return;
    }

    this.db.updateStuk(this.stuk).then(async (res) => {
      const toast = await this.toast.create({
        message: 'Stuk bijgewerkt',
        duration: 1000
      });
      toast.present();
      this.router.navigateByUrl('/tabs/repertoire');
    });
  }
}
