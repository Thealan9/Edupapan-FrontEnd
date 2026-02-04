import { Component, OnInit } from '@angular/core';
import { AdminBooking } from '../services/admin-booking';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: false,
})
export class BookingsPage implements OnInit {

  bookings: any[] = [];
  loading = true;

  constructor(
    private serviceBooking: AdminBooking,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.load();

    this.serviceBooking.refresh$.subscribe(() => {
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.serviceBooking.getBookings().subscribe({
      next: (res) => {
        this.bookings = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  async editStatus(id: number , status: string) {
      const modal = await this.modalCtrl.create({
        component: BookingModalComponent,
        componentProps: {
          bookingId: id,
          status: status
        },
      });

      modal.onDidDismiss().then((res) => {
        if (res.data?.refresh) {
          this.load();
        }
      });

      await modal.present();
    }


  delete(id: number) {
    if (!confirm('¿Eliminar reserva?')) return;
    this.serviceBooking.deleteBooking(id).subscribe(() => this.load());
  }
}
