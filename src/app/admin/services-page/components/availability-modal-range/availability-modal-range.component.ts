import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminAvailability } from 'src/app/admin/services/admin-availability';
import { serviceAvailability } from 'src/app/interfaces/admin/serviceAvailability.model';

@Component({
  selector: 'app-availability-modal-range',
  templateUrl: './availability-modal-range.component.html',
  styleUrls: ['./availability-modal-range.component.scss'],
  standalone: false,
})
export class AvailabilityModalRangeComponent implements OnInit {

  @Input() serviceId!: number;
  @Input() availability?: serviceAvailability;

  isEdit = false;

  days = [
    { key: 'mon', label: 'Lunes', value: 1 },
    { key: 'tue', label: 'Martes', value: 2 },
    { key: 'wed', label: 'Miércoles', value: 3 },
    { key: 'thu', label: 'Jueves', value: 4 },
    { key: 'fri', label: 'Viernes', value: 5 },
    { key: 'sat', label: 'Sábado', value: 6 },
    { key: 'sun', label: 'Domingo', value: 7 },
  ];


  form = this.fb.group({
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    mon: [true],
    tue: [true],
    wed: [true],
    thu: [true],
    fri: [true],
    sat: [false],
    sun: [false]
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

  private getSelectedDays(): number[] {
    const values = this.form.value;
    return this.days
      .filter(d => values[d.key as keyof typeof values])
      .map(d => d.value);
  }

  submitRange() {
    if (this.form.invalid) return;

    const payload = {
      start_date: this.form.value.start_date,
      end_date: this.form.value.end_date,
      start_time: this.form.value.start_time,
      end_time: this.form.value.end_time,
      days: this.getSelectedDays(),
    };

    this.availabilityService
      .createRange(this.serviceId, payload)
      .subscribe(() => {
        this.close(true);
      });
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
