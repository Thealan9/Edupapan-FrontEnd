import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminServices } from '../../services/admin-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone:false
})
export class CreatePage  {

  form = this.fb.group({
    user_id: [null, Validators.required],
    name: ['', Validators.required],
    description: [''],
    base_price: [0, Validators.required],
    active: [true]
  });

  constructor(
    private fb: FormBuilder,
    private service: AdminServices,
    private router: Router
  ) {}

  save() {
    if (this.form.invalid) return;

    this.service.createService(this.form.value).subscribe(() => {
      this.router.navigateByUrl('/admin/services');
    });
  }

}
