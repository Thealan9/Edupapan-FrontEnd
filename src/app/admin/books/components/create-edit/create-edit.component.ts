import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, MaxLengthValidator, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AdminBooks } from 'src/app/admin/services/admin-books';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Book } from 'src/app/interfaces/admin/book.model';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: false,
})
export class CreateEditComponent  implements OnInit {
@Input() data?: Book;

  isEdit = false;
  isSubmitting = false;

  form = this.fb.group({
    title: ['',[Validators.required,Validators.maxLength(255)],],
    isbn: ['',[Validators.required, Validators.minLength(13),Validators.maxLength(13)],],
    level: ['',[Validators.required],],
    price: [0,[Validators.required, Validators.min(0)],],
    supplier: ['',[Validators.required,Validators.maxLength(255)],],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminBooks,
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

    const data = this.form.getRawValue() as Partial<Book>;

    if (this.isEdit) {
      this.Service.updateBook(this.data!.id, data)
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
      this.Service.createBook(data)
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
