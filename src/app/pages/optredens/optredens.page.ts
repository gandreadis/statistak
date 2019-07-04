import {DatabaseService, Optreden} from '../../services/database.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-optredens',
  templateUrl: './optredens.page.html',
  styleUrls: ['./optredens.page.scss'],
})
export class OptredensPage implements OnInit {

  optredens: Optreden[] = [];

  constructor(private db: DatabaseService) {
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getOptredens().subscribe(optredens => {
          this.optredens = optredens;
        });
      }
    });
  }

}
