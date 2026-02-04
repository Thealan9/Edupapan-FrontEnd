import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsers } from '../../services/admin-users';
import { User } from 'src/app/interfaces/admin/user.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false,
})
export class EditPage implements OnInit {
  userId!: number;
  loading = true;
  error: boolean = false;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    //active: [true],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private adminUsers: AdminUsers,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  loadUser() {
    this.loading = true;
    this.adminUsers.getUser(this.userId).subscribe({
      next: user =>{
      this.form.patchValue(user);
      this.loading = false;

      },
      error: err =>{
        console.log("error al cargar el locar",err)
        this.loading = false;
        this.error = !this.error;
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<User>;

    this.adminUsers.updateUser(this.userId, data).subscribe({
      next: () => this.router.navigateByUrl('/admin/users'),
      error: (err) => {
        if (err.status === 422) {
          alert(err.error.message);
        } else {
          console.error(err);
        }
      },
    });
  }
}
