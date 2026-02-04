import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminAvailability } from 'src/app/admin/services/admin-availability';
import { serviceAvailability } from 'src/app/interfaces/admin/serviceAvailability.model';

@Component({
  selector: 'app-availability-modal',
  templateUrl: './availability-modal.component.html',
  styleUrls: ['./availability-modal.component.scss'],
  standalone:false
})
export class AvailabilityModalComponent  implements OnInit {

  @Input() serviceId!: number;
  @Input() availability?: serviceAvailability;

  isEdit = false;

  form = this.fb.group({
    date: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    available: [true]
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private availabilityService: AdminAvailability
  ) {}

  ngOnInit() {
    if (this.availability) {
      this.isEdit = true;
      this.form.patchValue(this.availability);
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<serviceAvailability>;

    if (this.isEdit) {
      this.availabilityService
        .updateAvailability(this.availability!.id, data)
        .subscribe(() => this.close(true));
    } else {
      this.availabilityService
        .createAvailability(this.serviceId, data)
        .subscribe(() => this.close(true));
    }
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }

}
