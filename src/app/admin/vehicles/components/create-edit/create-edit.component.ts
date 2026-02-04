import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminVehicles } from 'src/app/admin/services/admin-vehicles';
import { Vehicle } from 'src/app/interfaces/admin/vehicle.model';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: false,
})
export class CreateEditComponent implements OnInit {
  @Input() data?: Vehicle;

  isEdit = false;

  form = this.fb.group({
    plate: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(20)],],
    model: ['',[Validators.required, Validators.maxLength(255)],],
    is_active: [true],
    is_available: [true],
    driver_id: [null as number | null],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminVehicles,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.isEdit = true;

      const normalizedData = {
        ...this.data,
        is_active: Boolean(this.data.is_active),
        is_available: Boolean(this.data.is_available),
      };

      this.form.patchValue(normalizedData);
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<Vehicle>;

    console.log('Submitting vehicle data:', data);
    if (this.isEdit) {
      this.Service.updateVehicle(this.data!.id, data).subscribe(() =>
        this.close(true),
      );
    } else {
      this.Service.createVehicle(data).subscribe(() => this.close(true));
    }
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
