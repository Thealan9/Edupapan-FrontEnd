import { Component, OnInit } from '@angular/core';
import { Pallet } from 'src/app/interfaces/admin/pallet.model';
import { AdminPallets } from '../services/admin-pallets';
import { ModalController } from '@ionic/angular';
import { CreateEditComponent } from './components/create-edit/create-edit.component';

@Component({
  selector: 'app-pallets',
  templateUrl: './pallets.page.html',
  styleUrls: ['./pallets.page.scss'],
  standalone: false,
})
export class PalletsPage implements OnInit {

    pallets: Pallet[] = [];
    loading = true;

    constructor(
      private Service: AdminPallets,
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
      this.Service.getPallets().subscribe({
        next: (res) => {
          this.pallets = res;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }

    delete(id: number) {
      if (!confirm('¿Eliminar pallet?')) return;
      this.Service.deletePallet(id).subscribe(() => this.load());
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
    async openEdit(vehicle: Pallet) {
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
