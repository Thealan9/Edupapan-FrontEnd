import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
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
  isSubmitting = false;



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
    if (this.isSubmitting) return;
    this.isSubmitting = true;

      this.Service.approvePartial(this.TicketId)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => this.handleSuccess(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.handleSuccess(err.error.message, 'warning');
          } else {
            this.handleSuccess('Oops, ocurrió un error!', 'error');
          }
        },
      });
  }

  reject() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
      this.Service.rejectPartial(this.TicketId)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => this.handleSuccess(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.handleSuccess(err.error.message, 'warning');
          } else {
            this.handleSuccess('Oops, ocurrió un error!', 'error');
          }
        },
      });
  }

  async handleSuccess(message: string, color: string) {
    await this.modalCtrl.dismiss({
      message: message,
      type: color,
    });
  }
  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
