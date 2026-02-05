import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { AdminDashboard } from '../services/admin-dashboard';
import { AdminDashboardResponse } from 'src/app/interfaces/admin/admin-dashboard.interface';
import { CreateComponent } from './components/create/create.component';
import { ModalController } from '@ionic/angular';

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
    private dashboard: AdminDashboard,
    private modalCtrl: ModalController,
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

  }
  async openCreate() {
      const modal = await this.modalCtrl.create({
        component: CreateComponent,
      });

      modal.onDidDismiss().then((res) => {
      });

      await modal.present();
    }

}
