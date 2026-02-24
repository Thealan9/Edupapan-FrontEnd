import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/interfaces/admin/book.model';
import { AdminBooks } from '../services/admin-books';
import { ModalController } from '@ionic/angular';
import { CreateEditComponent } from './components/create-edit/create-edit.component';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
  standalone: false,
})
export class BooksPage implements OnInit {
  books: Book[] = [];
  loading = true;

  constructor(
    private Service: AdminBooks,
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
    this.Service.getBooks().subscribe({
      next: (res) => {
        this.books = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar libro?')) return;
    this.Service.deleteBook(id).subscribe({
        next: (res) => {this.load(); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.showAlert(err.error.message, 'warning');
          } else {
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
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
  async openEdit(book: Book) {
    const modal = await this.modalCtrl.create({
      component: CreateEditComponent,
      componentProps: {
        data: book,
      },
    });
    modal.onDidDismiss().then((res) => {
      if (res.data?.refresh) {
        this.load();
      }
    });

    await modal.present();
  }

  async showAlert(
        message: string,
        type: 'success' | 'error' | 'warning'
      ) {
        const modal = await this.modalCtrl.create({
          component: AlertComponent,
          componentProps: { message, type },
          cssClass: 'small-alert-modal',
          backdropDismiss: false,
        });

        await modal.present();
      }

}
