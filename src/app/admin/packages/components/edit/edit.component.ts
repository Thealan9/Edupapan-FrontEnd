import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AdminPackages } from 'src/app/admin/services/admin-packages';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Package } from 'src/app/interfaces/admin/package.model';
import { PackageResponse } from 'src/app/interfaces/admin/packageResonse.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone:false
})
export class EditComponent  implements OnInit {

  @Input() packageId!: number;
  isSubmitting = false;

  package: any = null;
  pallets: any[] = [];
  books: any[] = [];
  loading = true;

  form = this.fb.group({
    batch_number: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(20)],],
    book_id: [0,[Validators.required],],
    pallet_id: [0,[Validators.required,],],
    book_quantity: [0,[Validators.required, Validators.min(20)],],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminPackages,
  ) {}

  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.Service.getPackage(this.packageId).subscribe({
      next: (res) => {
        this.form.patchValue(res.package);

        this.pallets = res.pallets;

        this.books = Object.entries(res.books).map(([title, id]) => ({
          title,
          id,
        }));

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  submit() {
    if (this.form.invalid) return;
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const data = this.form.getRawValue() as Partial<Package>;

      this.Service.updatePackage(this.packageId, data)
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
