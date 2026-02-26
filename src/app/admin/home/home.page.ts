import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { AdminDashboard } from '../services/admin-dashboard';
import { AdminDashboardResponse } from 'src/app/interfaces/admin/admin-dashboard.interface';
import { CreateComponent } from './components/create/create.component';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AdminTickets } from '../services/admin-tickets';
import { RequestPartialComponent } from './components/request-partial/request-partial.component';
import { SolutionPackageComponent } from './components/solution-package/solution-package.component';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{
  stats!: AdminDashboardResponse['stats'];
  activity: AdminDashboardResponse['recent_activity'] = [];

  request: any[] = [];
  solveDetails: any[] = [];
  loadingNotifi = true;

  constructor(
    private auth: Auth,
    private router: Router,
    private Service: AdminTickets,
    private dashboard: AdminDashboard,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.load();

    this.Service.refresh$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.load();
    });
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.loadingNotifi = true;

    forkJoin({
      requests: this.Service.getWarehouseRequests(),
      solutions: this.Service.getPackageSolutions(),
    }).subscribe({
      next: ({ requests, solutions }) => {
        this.request = requests;
        this.solveDetails = solutions;
        this.loadingNotifi = false;
      },
      error: () => {
        this.loadingNotifi = false;
      },
    });
  }


  async openRequest(id: number) {
    const modal = await this.modalCtrl.create({
      component: RequestPartialComponent,
      componentProps: {
        TicketId: id,
      },
    });

    modal.onDidDismiss().then(async (res) => {
      if (res?.data) {
        this.showAlert(res.data.message, res.data.type);
      }
    });

    await modal.present();
  }

  async openSolution(id: number) {
    const modal = await this.modalCtrl.create({
      component: SolutionPackageComponent,
      componentProps: {
        detailId: id,
      },
    });

    modal.onDidDismiss().then(async (res) => {
      if (res?.data) {
        this.showAlert(res.data.message, res.data.type);
      }
    });

    await modal.present();
  }

  async showAlert(message: string, type: 'success' | 'error' | 'warning') {
    const modal = await this.modalCtrl.create({
      component: AlertComponent,
      componentProps: { message, type },
      cssClass: 'small-alert-modal',
      backdropDismiss: false,
    });

    await modal.present();
  }
}
