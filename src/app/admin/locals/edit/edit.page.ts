import { Component, OnInit } from '@angular/core';
import { AdminLocal } from '../../services/admin-local';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Local } from 'src/app/interfaces/admin/local.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone:false

})
export class EditPage implements OnInit {
  localId!: number;
  loading = true;
  error: boolean = false;


  form = this.fb.group({
    name: ['', Validators.required],
    address: [''],
    active: [true],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private localService: AdminLocal,
    private router: Router
  ) {}

  ngOnInit() {
    this.localId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLocal();
  }

  loadLocal() {
    this.loading = true;
    this.localService.getLocal(this.localId).subscribe({
      next: local =>{
      this.form.patchValue(local);
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

      const data = this.form.getRawValue() as Partial<Local>;

      this.localService.updateLocal(this.localId, data).subscribe({
        next: () => this.router.navigateByUrl('/admin/locales'),
        error: (err) => {
          console.error('Error al guardar cambios', err);
        },
      });
    }
}
