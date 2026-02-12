import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { AdminDashboard } from '../services/admin-dashboard';
import { AdminDashboardResponse } from 'src/app/interfaces/admin/admin-dashboard.interface';
import { CreateComponent } from './components/create/create.component';
import { ModalController } from '@ionic/angular';
import { AdminTickets } from '../services/admin-tickets';
import { RequestPartialComponent } from './components/request-partial/request-partial.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false,
})
export class HomePage  {
  stats!: AdminDashboardResponse['stats'];
  activity: AdminDashboardResponse['recent_activity'] = [];

  request: any[] = [];
  solveDetails:any[]=[];
  loadingNotifi = true;

  constructor(
    private auth: Auth,
    private router: Router,
    private Service: AdminTickets,
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
    this.load();
    this.Service.refresh$.subscribe(() => {
      this.load();
    });
  }

  load() {
    this.loadingNotifi = true;
    this.Service.getWarehouseRequests().subscribe({
      next: (res) => {
        this.request = res;
        this.loadingNotifi = false;
      },
      error: () => (this.loadingNotifi = false),
    });
  }

  async openCreate() {
      const modal = await this.modalCtrl.create({
        component: CreateComponent,
      });

      modal.onDidDismiss().then((res) => {
      });

      await modal.present();
    }

    async openRequest(id:number) {
      const modal = await this.modalCtrl.create({
        component: RequestPartialComponent,
        componentProps:{
          TicketId:id
        }
      });

      modal.onDidDismiss().then((res) => {
      });

      await modal.present();
    }

}
