import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsers } from '../../services/admin-users';
import { User } from 'src/app/interfaces/admin/user.model';
import { AdminLocal } from '../../services/admin-local';
import { Local } from 'src/app/interfaces/admin/local.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone:false

})
export class CreatePage implements OnInit {

  form = this.fb.group({
  name: ['', Validators.required],
  address: [''],
  user_id: [null, Validators.required],
});

constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminUsers: AdminUsers,
    private localService: AdminLocal,
    private router: Router
  ) {}

users: User[] = [];
loading = false;

ngOnInit() {
  this.loading = false;
  this.loadUsers();
}

loadUsers() {
  this.adminUsers.getUsers().subscribe(res => {
    this.users = res;
  });
}

save() {
  if (this.form.invalid) return;

  this.loading = true;

  const data = this.form.getRawValue() as Partial<Local>;

  this.localService.createLocal(data).subscribe({
    next: () => this.router.navigateByUrl('/admin/locales'),
     error: (err) => {
        if (err.status === 422) {
          alert(err.error.message);
          this.loading = false;
        } else {
          console.error(err);
          this.loading = false;
        }
      }
  });
}

}
