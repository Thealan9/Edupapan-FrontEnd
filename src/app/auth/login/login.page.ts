import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
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
        console.error('Login error', err);
      }
    });
  }
}
