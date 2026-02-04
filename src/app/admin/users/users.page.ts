import { Component, OnInit } from '@angular/core';
import { AdminUsers } from '../services/admin-users';
import { User } from 'src/app/interfaces/admin/user.model';
import { Auth } from 'src/app/core/auth';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone:false
})
export class UsersPage implements OnInit {

  users: any[] = [];
  loading = true;
  authUser!: User;

  constructor(private adminUsers: AdminUsers,private auth: Auth) { }

  async ngOnInit() {
    const user = await this.auth.getUser();

    if (user) {
    this.authUser = user;
  } else {
    console.warn('No se encontró el usuario');
  }

    this.loadUsers();

    this.adminUsers.refresh$.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.loading = true;
    this.adminUsers.getUsers().subscribe({
      next: res => {
        this.users = res;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading users', err);
        this.loading = false;
      }
    });
  }

  canEdit(user: User) {
    return user.id !== this.authUser.id;
  }

  toggleActive(user: User) {
  this.adminUsers.toggleActive(user.id).subscribe(() => this.loadUsers());
  }

  delete(user: User){
    if (!confirm('¿Eliminar usuario?')) return;
    this.adminUsers.deleteUser(user.id).subscribe(() => this.loadUsers());
  }

}
