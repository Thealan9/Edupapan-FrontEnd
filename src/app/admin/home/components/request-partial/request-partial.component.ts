import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-request-partial',
  templateUrl: './request-partial.component.html',
  styleUrls: ['./request-partial.component.scss'],
  standalone:false
})
export class RequestPartialComponent implements OnInit{
  @Input() TicketId!: number;

  response:any = null;
  loading = true;
  isSubmitting = false;



  constructor(
    private modalCtrl: ModalController,
    private Service: AdminTickets,
  ) {}

  ngOnInit() {
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
        next: (res) => this.showAlert(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.showAlert(err.error.message, 'warning');
          } else {
            this.showAlert('Oops, ocurrió un error!', 'error');
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
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.showAlert(err.error.message, 'warning');
          } else {
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
  }

  async showAlert(
          message: string,
          type: 'success' | 'error' | 'warning'
        ) {
          const modal = await this.modalCtrl.create({
            component: AlertComponent,
            componentProps: { message, type },
            cssClass: 'small-alert-modal',
            backdropDismiss: false,
          });

          await modal.present();
        }
  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
