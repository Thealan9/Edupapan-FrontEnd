import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminPallets } from 'src/app/admin/services/admin-pallets';
import { Pallet } from 'src/app/interfaces/admin/pallet.model';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: false,
})
export class CreateEditComponent  implements OnInit {

  @Input() data?: Pallet;

  isEdit = false;

  form = this.fb.group({
    pallet_code: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(20)],],
    warehouse_location: ['',[Validators.required, Validators.maxLength(255)],],
    status: ['empty',[Validators.required],],
    max_packages_capacity: [1,[Validators.required, Validators.min(1),Validators.max(50)],],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminPallets,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<Pallet>;

    if (this.isEdit) {
      this.Service.updatePallet(this.data!.id, data).subscribe(() =>
        this.close(true),
      );
    } else {
      this.Service.createPallet(data).subscribe(() => this.close(true));
    }
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
