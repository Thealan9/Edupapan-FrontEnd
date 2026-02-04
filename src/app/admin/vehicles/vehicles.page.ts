import { Component, OnInit } from '@angular/core';
import { AdminVehicles } from '../services/admin-vehicles';
import { ModalController } from '@ionic/angular';
import { CreateEditComponent } from './components/create-edit/create-edit.component';
import { Vehicle } from 'src/app/interfaces/admin/vehicle.model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
  standalone: false,
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;

  constructor(
    private Service: AdminVehicles,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.load();

    this.Service.refresh$.subscribe(() => {
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.Service.getVehicles().subscribe({
      next: (res) => {
        this.vehicles = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar vehículo?')) return;
    this.Service.deleteVehicle(id).subscribe(() => this.load());
  }
  async openCreate() {
    const modal = await this.modalCtrl.create({
      component: CreateEditComponent,
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.load();
      }
    });

    await modal.present();
  }
  async openEdit(vehicle: Vehicle) {
    const modal = await this.modalCtrl.create({
      component: CreateEditComponent,
      componentProps: {
        data:vehicle
      },
    });
    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.load();
      } });

    await modal.present();
  }
}
