import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminServices } from 'src/app/admin/services/admin-services';

@Component({
  selector: 'app-create-service-modal',
  templateUrl: './create-service-modal.component.html',
  styleUrls: ['./create-service-modal.component.scss'],
  standalone: false,
})
export class CreateServiceModalComponent {
  step = 1;

  form = this.fb.group({
    service: this.fb.group({
      user_id: [null, Validators.required],
      name: ['', Validators.required],
      description: [''],
      base_price: [1, Validators.required],
      active: [true],
    }),

    contexts: this.fb.array([]),

    availability_range: this.fb.group({
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
      sun: [false],
    }),
  });

  days = [
    { key: 'mon', label: 'Lunes', value: 1 },
    { key: 'tue', label: 'Martes', value: 2 },
    { key: 'wed', label: 'Miércoles', value: 3 },
    { key: 'thu', label: 'Jueves', value: 4 },
    { key: 'fri', label: 'Viernes', value: 5 },
    { key: 'sat', label: 'Sábado', value: 6 },
    { key: 'sun', label: 'Domingo', value: 7 },
  ];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private service: AdminServices
  ) {}

  next() {
    if (this.step < 3) this.step++;
  }

  back() {
    if (this.step > 1) this.step--;
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }

  get contexts() {
    return this.form.get('contexts') as FormArray;
  }

  addContext() {
    this.contexts.push(
      this.fb.group({
        context: ['public', Validators.required],
        local_id: [null as number | null],
        price_override: [null as number | null],
        active: [true],
      })
    );
  }

  removeContext(i: number) {
    this.contexts.removeAt(i);
  }

  //dispo

  private getSelectedDays(): number[] {
    const values = this.form.get('availability_range')?.value;

    if (!values) return [];

    return this.days
      .filter((d) => values[d.key as keyof typeof values])
      .map((d) => d.value);
  }

  finalize() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rawValues = this.form.getRawValue();

    const payload = {
      service: rawValues.service,
      contexts: rawValues.contexts,

      availabilities: [
        {
          start_date: rawValues.availability_range.start_date,
          end_date: rawValues.availability_range.end_date,
          start_time: rawValues.availability_range.start_time,
          end_time: rawValues.availability_range.end_time,
          days: this.getSelectedDays(),
        },
      ],
    };
console.log(payload);
    this.service.createService(payload).subscribe({
      next: () => this.close(true),
      error: (err) => {
        console.error('Error al crear el servicio completo', err);

      },
    });
  }
}
