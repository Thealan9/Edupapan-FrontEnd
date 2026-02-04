import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminBooking } from 'src/app/admin/services/admin-booking';
import { AdminContexts } from 'src/app/admin/services/admin-contexts';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
  standalone:false
})
export class BookingModalComponent  implements OnInit {

  @Input() bookingId!: number;
  @Input() status!: string;


  form = this.fb.group({
    status: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private serviceBooking: AdminBooking
  ) {}

  ngOnInit() {
      this.form.patchValue({ status: this.status })
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    this.serviceBooking
      .updateStatus(this.bookingId, data)
      .subscribe(() => this.close(true));

  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }

}
