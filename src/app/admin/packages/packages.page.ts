import { Component, OnInit } from '@angular/core';
import { Package } from 'src/app/interfaces/admin/package.model';
import { AdminPackages } from '../services/admin-packages';
import { ModalController } from '@ionic/angular';
import { EditComponent } from './components/edit/edit.component';
import { PackageResponse } from 'src/app/interfaces/admin/packageResonse.model';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
  standalone:false
})
export class PackagesPage implements OnInit{

    packages: PackageResponse[] = [];
    loading = true;

    constructor(
      private Service: AdminPackages,
      private modalCtrl: ModalController,
    ) {}

    ngOnInit(){
      this.load();

      this.Service.refresh$.subscribe(() => {
        this.load();
      });
    }

    load() {
      this.loading = true;
      this.Service.getPackages().subscribe({
        next: (res) => {
          this.packages = res;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }
    async openEdit(p: number) {
      const modal = await this.modalCtrl.create({
        component: EditComponent,
        componentProps: {
          packageId:p
        },
      });
      modal.onDidDismiss().then((res) => {
        if (res.data?.refresh) {
          this.load();
        } });

      await modal.present();
    }

}
