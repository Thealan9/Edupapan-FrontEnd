import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/auth';
import { WarehouseTicket } from '../services/warehouse-ticket';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tickets: any[] = [];
  loading = true;

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
    this.Service.acceptTicket(id).subscribe(() => this.load());
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

}
