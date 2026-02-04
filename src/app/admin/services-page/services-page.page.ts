import { Component, OnInit } from '@angular/core';
import { AdminServices } from '../services/admin-services';
import { CreateServiceModalComponent } from './components/create-service-modal/create-service-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.page.html',
  styleUrls: ['./services-page.page.scss'],
  standalone: false,
})
export class ServicesPagePage implements OnInit {
  services: any[] = [];
  loading = true;

  constructor(
    private service: AdminServices,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.load();

    this.service.refresh$.subscribe(() => {
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.service.getServices().subscribe({
      next: (res) => {
        this.services = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar servicio?')) return;
    this.service.deleteService(id).subscribe(() => this.load());
  }
  async openCreate() {
      const modal = await this.modalCtrl.create({
        component: CreateServiceModalComponent,
      });

      modal.onDidDismiss().then((res) => {
        if (res.data?.refresh) {
          this.load();
        }
      });

      await modal.present();
    }
}
