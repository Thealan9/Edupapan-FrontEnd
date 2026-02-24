import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Auth } from 'src/app/core/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    const token = await this.auth.getToken();
    if (token) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  login() {
  if (this.form.invalid) return;

  const { email, password } = this.form.value;
  if (!email || !password) return;

  this.auth.login({ email, password }).subscribe({
    next: res => {
      if (res.user.role === 'admin') {
        this.router.navigateByUrl('/admin', { replaceUrl: true });
      } else {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    },
      error: err => {
        if (err.status === 401 || err.status === 403) {
            this.showAlert(err.error.message, 'warning');
          }else{
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
      }
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
        setTimeout(() => {
          modal.dismiss();
        }, 2500);
      }
}
