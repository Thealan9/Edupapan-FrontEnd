import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { serviceAvailability } from 'src/app/interfaces/admin/serviceAvailability.model';
import { AdminServices } from '../../services/admin-services';
import { AdminAvailability } from '../../services/admin-availability';
import { ModalController } from '@ionic/angular';
import { AvailabilityModalComponent } from '../components/availability-modal/availability-modal.component';
import { AvailabilityModalRangeComponent } from '../components/availability-modal-range/availability-modal-range.component';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.page.html',
  styleUrls: ['./availability.page.scss'],
  standalone:false
})
export class AvailabilityPage implements OnInit {

  serviceId!: number;
  availabilities: serviceAvailability[] = [];


  constructor(
    private route: ActivatedRoute,
    private service: AdminServices,
    private availabilityService: AdminAvailability,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.serviceId = Number(this.route.snapshot.paramMap.get('service_id'));
    this.loadService();
  }

  loadService() {
    this.service.getService(this.serviceId).subscribe((res) => {
      this.availabilities = res.availabilities;
    });
  }



  toggle(availabilities: serviceAvailability) {
    this.availabilityService
      .updateAvailability(availabilities.id, {
        available: !availabilities.available,
      })
      .subscribe(() => this.loadService());
  }

  async edit(availability: serviceAvailability) {
    const modal = await this.modalCtrl.create({
      component: AvailabilityModalComponent,
      componentProps: {
        serviceId: this.serviceId,
        availability,
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.loadService();
      }
    });

    await modal.present();
  }

  async openCreate() {
    const modal = await this.modalCtrl.create({
      component: AvailabilityModalComponent,
      componentProps: {
        serviceId: this.serviceId
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.loadService();
      }
    });

    await modal.present();
  }

  async openRange() {
    const modal = await this.modalCtrl.create({
      component: AvailabilityModalRangeComponent,
      componentProps: {
        serviceId: this.serviceId
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.loadService();
      }
    });

    await modal.present();
  }

}
