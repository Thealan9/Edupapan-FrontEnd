import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';

@Component({
  selector: 'app-request-partial',
  templateUrl: './request-partial.component.html',
  styleUrls: ['./request-partial.component.scss'],
  standalone:false
})
export class RequestPartialComponent {
  @Input() TicketId!: number;

  response:any = null;
  loading = true;


  constructor(
    private modalCtrl: ModalController,
    private Service: AdminTickets,
  ) {}

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.loading = true;
    this.Service.getWarehouseRequest(this.TicketId).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }


  accept() {
      this.Service.approvePartial(this.TicketId).subscribe(() =>
        this.close(true),
      );
  }

  reject() {
      this.Service.rejectPartial(this.TicketId).subscribe(() =>
        this.close(true),
      );
  }
  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
