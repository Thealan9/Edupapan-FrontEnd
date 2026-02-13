import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';

@Component({
  selector: 'app-solution-package',
  templateUrl: './solution-package.component.html',
  styleUrls: ['./solution-package.component.scss'],
  standalone:false
})
export class SolutionPackageComponent {
  @Input() detailId!: number;

  response:any = null;
  loading = true;

  confirm: boolean = true;
  isPartial: boolean = false;
  assignedTo: number | null = null;
  workers: any = null;

  constructor(
    private modalCtrl: ModalController,
    private Service: AdminTickets,
    private toast: ToastController
  ) {}

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.loading = true;
    this.Service.getPackageSolution(this.detailId).subscribe({
      next: (res) => {
        this.response = res.detail;
        this.workers = Object.entries(res.workers).map(([name, id]) => ({
          name,
          id,
        }));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  submit() {
    if (this.response.status === 'damaged') {
      const data = {
        confirm: this.confirm,
        partial: this.isPartial,
        assigned_to: this.assignedTo
      };
      console.log("datos ",data)

      this.Service.solutionDamage(this.detailId, data).subscribe({
        next: (res) => this.handleSuccess(res.message),
        error: (err) => console.error(err)
      });
    } else if (this.response.status === 'missing') {
      this.Service.solutionMissing(this.detailId, { confirm: this.confirm }).subscribe({
        next: (res) => this.handleSuccess(res.message),
        error: (err) => console.error(err)
      });
    }
  }

  async handleSuccess(message: string) {
    const t = await this.toast.create({ message, duration: 2000, color: 'success' });
    await t.present();
    this.modalCtrl.dismiss({ refresh: true });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
