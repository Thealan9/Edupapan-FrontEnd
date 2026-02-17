import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminPackages } from 'src/app/admin/services/admin-packages';
import { Package } from 'src/app/interfaces/admin/package.model';
import { PackageResponse } from 'src/app/interfaces/admin/packageResonse.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone:false
})
export class EditComponent  implements OnInit {

  @Input() packageId!: number;

  package: any = null;
  pallets: any[] = [];
  books: any[] = [];
  loading = true;

  form = this.fb.group({
    batch_number: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(20)],],
    book_id: [0,[Validators.required],],
    pallet_id: [0,[Validators.required,],],
    book_quantity: [0,[Validators.required, Validators.min(20)],],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminPackages,
  ) {}

  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.Service.getPackage(this.packageId).subscribe({
      next: (res) => {
        this.form.patchValue(res.package);

        this.pallets = res.pallets;

        this.books = Object.entries(res.books).map(([title, id]) => ({
          title,
          id,
        }));

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<Package>;

      this.Service.updatePackage(this.packageId, data).subscribe(() =>
        this.close(true),
      );

  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
