import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServices } from '../../services/admin-services';
import { Service } from 'src/app/interfaces/admin/service.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone:false
})
export class EditPage implements OnInit {
  id!: number;
  loading = true;
  error: boolean = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    base_price: [0, Validators.required],
    active: [true]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: AdminServices,
    private router: Router
  ) {}

  ngOnInit() {
  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.loadService();
}

loadService(){
    this.loading = true;
    this.service.getService(this.id).subscribe({
      next: service =>{
      this.form.patchValue(service);
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

  const data = this.form.getRawValue() as Partial<Service>;

  this.service.updateService(this.id, data).subscribe({
      next: () => this.router.navigateByUrl('/admin/services'),
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
