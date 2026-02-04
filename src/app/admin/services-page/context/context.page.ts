import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceContext } from 'src/app/interfaces/admin/serviceContext.model';
import { AdminServices } from '../../services/admin-services';
import { AdminContexts } from '../../services/admin-contexts';
import { ModalController } from '@ionic/angular';
import { ContextModalComponent } from '../components/context-modal/context-modal.component';

@Component({
  selector: 'app-context',
  templateUrl: './context.page.html',
  styleUrls: ['./context.page.scss'],
  standalone: false,
})
export class ContextPage implements OnInit {
  serviceId!: number;
  contexts: ServiceContext[] = [];
  basePrice = 0;

  constructor(
    private route: ActivatedRoute,
    private service: AdminServices,
    private contextService: AdminContexts,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.serviceId = Number(this.route.snapshot.paramMap.get('service_id'));
    this.loadService();
  }

  loadService() {
    this.service.getService(this.serviceId).subscribe((res) => {
      this.basePrice = res.base_price;
      this.contexts = res.contexts;
    });
  }

  // loadContexts() {
  //   this.contextService.getContexts(this.serviceId).subscribe(res => {
  //     this.contexts = res;
  //   });
  // }

  toggle(context: ServiceContext) {
    this.contextService
      .updateContext(context.id, {
        active: !context.active,
      })
      .subscribe(() => this.loadService());
  }

  async edit(context: ServiceContext) {
    const modal = await this.modalCtrl.create({
      component: ContextModalComponent,
      componentProps: {
        serviceId: this.serviceId,
        context,
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
      component: ContextModalComponent,
      componentProps: {
        serviceId: this.serviceId,
        basePrice: this.basePrice,
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
