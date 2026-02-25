import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';

@Component({
  selector: 'app-solution-package',
  templateUrl: './solution-package.component.html',
  styleUrls: ['./solution-package.component.scss'],
  standalone: false,
})
export class SolutionPackageComponent {
  @Input() detailId!: number;
  isSubmitting = false;

  response: any = null;
  loading = true;

  confirm: boolean = true;
  isPartial: boolean = false;
  assignedTo: number | null = null;
  workers: any = null;

  selectedAction: 'restore' | 'remove' | 'update' | null = null;
  otherDescription: string = '';
  updateData = {
    batch_number: '',
    book_id: null,
    book_quantity: 1,
    pallet_id: null,
  };
  pallets: any[] = [];
  books: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private Service: AdminTickets,
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
        this.pallets = res.pallets;
        this.books = Object.entries(res.books).map(([title, id]) => ({
          title,
          id,
        }));
        if (this.response.package) {
          this.updateData.batch_number = this.response.package.batch_number;
          this.updateData.book_id = this.response.package.book_id;
          this.updateData.book_quantity = this.response.package.book_quantity;
          this.updateData.pallet_id = this.response.package.pallet_id;
        }
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  submit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    if (this.response.status === 'damaged') {
      const data = {
        confirm: this.confirm,
        partial: this.isPartial,
        assigned_to: this.assignedTo,
      };


      this.Service.solutionDamage(this.detailId, data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => this.handleSuccess(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.handleSuccess(err.error.message, 'warning');
          } else {
            this.handleSuccess('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else if (this.response.status === 'missing') {
      this.Service.solutionMissing(this.detailId, {
        confirm: this.confirm,
      })
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => this.handleSuccess(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.handleSuccess(err.error.message, 'warning');
          } else {
            this.handleSuccess('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else if (this.response.status === 'other') {
      let payload: any = { action: this.selectedAction };

      if (this.selectedAction === 'remove') {
        payload.assigned_to = this.assignedTo;
        payload.description = this.otherDescription;
      } else if (this.selectedAction === 'update') {
        payload = { ...payload, ...this.updateData };
      }

      this.Service.solutionOther(this.detailId, payload)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => this.handleSuccess(res.message, 'success'),
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.handleSuccess(err.error.message, 'warning');
          } else {
            this.handleSuccess('Oops, ocurrió un error!', 'error');
          }
        },
      });
    }
  }

  async handleSuccess(message: string, color: string) {
    await this.modalCtrl.dismiss({
      message: message,
      type: color,
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
