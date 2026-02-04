import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminUsers } from '../../services/admin-users';
import { User } from 'src/app/interfaces/admin/user.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false
})
export class CreatePage implements OnInit {

  form = this.fb.group({
  name: ['', Validators.required],
  password: ['', Validators.required],
  active: [true],
  email: ['', [Validators.required, Validators.email]],
  role: ['user', Validators.required],
});

constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: AdminUsers,
    private router: Router
  ) {}

loading = false;

ngOnInit() {
  this.loading = false;
}

save() {
  if (this.form.invalid) return;

  this.loading = true;

  const data = this.form.getRawValue() as Partial<User>;

  this.userService.createUser(data).subscribe({
    next: () => this.router.navigateByUrl('/admin/users'),
     error: (err) => {
          console.error(err);
          this.loading = false;
      }
  });
}

}
