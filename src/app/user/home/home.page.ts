import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  logout() {
    this.auth.logoutApi().subscribe({
      next: async () => {
        await this.auth.logout();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: async () => {
        await this.auth.logout();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }

  ionViewWillEnter() {
    this.auth.yo().subscribe(user => {
    this.auth.setUser(user);
  });

  }

}
