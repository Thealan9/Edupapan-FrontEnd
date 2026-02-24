import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { WarehouseTicket } from '../services/warehouse-ticket';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tickets: any[] = [];
  loading = true;

  private snack = inject(MatSnackBar);
  constructor(
    private auth: Auth,
    private router: Router,
    private Service: WarehouseTicket
  ) { }

  ngOnInit() {
    this.load();

    this.Service.refresh$.subscribe(() => {
      this.load();
    });
  }
  load() {
    this.loading = true;
    this.Service.getTickets().subscribe({
      next: (res) => {
        this.tickets = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  acceptTicket(id: number) {
    this.Service.acceptTicket(id).subscribe({
        next: (res) => {this.Service.triggerRefresh(); this.showToast(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.showToast(err.error.message, 'warning');
          } else {
            this.showToast('Oops, ocurrió un error!', 'error');
          }
        },
      });
  }

  logout() {
    this.auth.logoutApi().subscribe({
      next: async () => {
        await this.auth.logout();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: async () => {
        await this.auth.logout();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.snack.open(message, '✖', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`],
    });
  }


}
