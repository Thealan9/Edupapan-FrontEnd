import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsers } from '../../services/admin-users';
import { User } from 'src/app/interfaces/admin/user.model';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage implements OnInit {

  isSubmitting = false;

  form = this.fb.group({
  name: ['', Validators.required],
  password: ['', Validators.required],
  active: [true],
  email: ['', [Validators.required, Validators.email]],
  role: ['user', Validators.required],
});

constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: AdminUsers,
    private router: Router,
    private modalCtrl: ModalController,

  ) {}

loading = false;

ngOnInit() {
  this.loading = false;
}

save() {
  if (this.form.invalid) return;
  if (this.isSubmitting) return;
  this.isSubmitting = true;

  this.loading = true;

  const data = this.form.getRawValue() as Partial<User>;

  this.userService.createUser(data)
  .pipe(finalize(() => this.isSubmitting = false))
  .subscribe({
      next: (res) => {this.router.navigateByUrl('/admin/users', { replaceUrl: true }),this.showAlert(res.message, 'success')},
      error: (err) => {
        if (err.status === 409 || err.status === 422) {
            this.showAlert(err.error.message, 'warning');
          } else {
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


}
