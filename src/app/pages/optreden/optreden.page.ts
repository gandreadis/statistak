import {Component, OnInit} from '@angular/core';
import {DatabaseService, Optreden, Stuk} from '../../services/database.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {SharedModule} from '../../shared/shared.module';

@Component({
  selector: 'app-optreden',
  templateUrl: './optreden.page.html',
  styleUrls: ['./optreden.page.scss'],
})
export class OptredenPage implements OnInit {
  optreden: Optreden = null;
  stukken: Stuk[] = [];

  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router, private toast: ToastController) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.route.paramMap.subscribe(params => {
          const optredenId = params.get('id');

          if (optredenId === '-1') {
            this.optreden = {
              id: -1,
              locatie: '',
              plaats: '',
              landCode: 'nl',
              longitude: 0,
              latitude: 0,
              datum: SharedModule.getCurrentDatum(),
              tijd: SharedModule.getCurrentTijd(),
              isBuiten: false,
              isSociaal: false,
              isOpenbaar: false,
              isBesloten: false,
              isWildOp: false,
              aantalBezoekers: 0,
              stukken: [],
            };
            return;
          }
          this.db.getOptreden(optredenId).then(data => {
            this.optreden = data;
          });
        });

        this.db.getStukken().subscribe(stukken => {
          this.stukken = stukken;
        });
      }
    });
  }

  containsStuk(stuk) {
    return this.optreden.stukken.filter(o => o.id === stuk.id).length > 0;
  }

  updateStuk(stuk, event) {
    if (event.detail.checked) {
      if (!this.containsStuk(stuk)) {
        this.optreden.stukken.push(stuk);
      }
    } else {
      if (this.containsStuk(stuk)) {
        this.optreden.stukken = this.optreden.stukken.filter(o => o.id !== stuk.id);
      }
    }
  }

  fixDatum() {
    this.optreden.datum = this.optreden.datum.split('T')[0];
  }

  delete() {
    if (this.optreden !== null && this.optreden.id === -1) {
      this.router.navigateByUrl('/tabs/optredens');
      return;
    }

    this.db.deleteOptreden(this.optreden.id).then(() => {
      this.router.navigateByUrl('/tabs/optredens');
    });
  }

  update() {
    if (this.optreden !== null && this.optreden.id === -1) {
      this.db.addOptreden(this.optreden).then(async (res) => {
        const toast = await this.toast.create({
          message: 'Optreden aangemaakt',
          duration: 1000
        });
        toast.present();
        this.router.navigateByUrl('/tabs/optredens');
      });
      return;
    }

    this.db.updateOptreden(this.optreden).then(async (res) => {
      const toast = await this.toast.create({
        message: 'Optreden bijgewerkt',
        duration: 1000
      });
      toast.present();
      this.router.navigateByUrl('/tabs/optredens');
    });
  }
}
