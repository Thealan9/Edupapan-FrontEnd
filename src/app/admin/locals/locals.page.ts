import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/core/auth';
import { User } from 'src/app/interfaces/admin/user.model';
import { AdminLocal } from '../services/admin-local';
import { Local } from 'src/app/interfaces/admin/local.model';

@Component({
  selector: 'app-locals',
  templateUrl: './locals.page.html',
  styleUrls: ['./locals.page.scss'],
  standalone:false
})
export class LocalsPage implements OnInit {

  locals: any[] = [];
  loading = true;
  authUser!: User;

  constructor(private localService: AdminLocal,private auth: Auth) { }

  async ngOnInit() {
    const user = await this.auth.getUser();

    if (user) {
    this.authUser = user;
  } else {
    console.warn('No se encontró el usuario');
  }

    this.loadLocals();

    this.localService.refresh$.subscribe(() => {
      this.loadLocals();
    });
  }

  loadLocals() {
    this.loading = true;
    this.localService.getLocals().subscribe({
      next: res => {
        this.locals = res;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando usuarios', err);
        this.loading = false;
      }
    });
  }

  delete(local: Local){
    if (!confirm('¿Eliminar local?')) return;
    this.localService.deleteLocal(local.id).subscribe(() => this.loadLocals());
  }

}
