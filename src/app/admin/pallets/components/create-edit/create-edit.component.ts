import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AdminPallets } from 'src/app/admin/services/admin-pallets';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Pallet } from 'src/app/interfaces/admin/pallet.model';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: false,
})
export class CreateEditComponent  implements OnInit {

  @Input() data?: Pallet;
  isSubmitting = false;

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
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const data = this.form.getRawValue() as Partial<Pallet>;

    if (this.isEdit) {
      this.Service.updatePallet(this.data!.id, data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else {
      this.Service.createPallet(data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    }
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
