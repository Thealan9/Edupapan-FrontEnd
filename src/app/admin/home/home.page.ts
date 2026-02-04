import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { AdminDashboard } from '../services/admin-dashboard';
import { AdminDashboardResponse } from 'src/app/interfaces/admin/admin-dashboard.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false,
})
export class HomePage  {
  stats!: AdminDashboardResponse['stats'];
  activity: AdminDashboardResponse['recent_activity'] = [];

  constructor(
    private auth: Auth,
    private router: Router,
    private dashboard: AdminDashboard
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
    this.dashboard.getDashboard().subscribe(res => {
      this.stats = res['stats'];
      this.activity = res['recent_activity'];

    });
  }

}
