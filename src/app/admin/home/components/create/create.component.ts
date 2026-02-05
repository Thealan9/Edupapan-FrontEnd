import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: false,
})
export class CreateComponent implements OnInit {
  @Input() data?: any;

  form = this.fb.group({
    type: ['', Validators.required],
    assigned_to: ['', [Validators.required]],
    book_id: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    description: [''],
    packages: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminTickets,
  ) {}

  ngOnInit() {
    this.form.get('type')?.valueChanges.subscribe((type) => {
      if (type) {
        this.managePackages(type);
      }
    });
  }

  get packages() {
    return this.form.get('packages') as FormArray;
  }

  addPackage() {
    const type = this.form.get('type')?.value;
    const packageGroup = this.fb.group({});


    if (type === 'entry') {
      packageGroup.addControl(
        'batch_number',
        this.fb.control('', Validators.required),
      );
      packageGroup.addControl(
        'book_quantity',
        this.fb.control(1, [Validators.required, Validators.min(1)]),
      );
      packageGroup.addControl(
        'moved_to_pallet',
        this.fb.control('', Validators.required),
      );
    } else {
      packageGroup.addControl(
        'package_id',
        this.fb.control('', Validators.required),
      );

      if (type === 'change') {
        packageGroup.addControl(
          'moved_to_pallet',
          this.fb.control('', Validators.required),
        );
      }
    }

    this.packages.push(packageGroup);
  }

  removePackage(index: number) {
    this.packages.removeAt(index);
  }

  managePackages(type: string) {
    while (this.packages.length !== 0) {
      this.packages.removeAt(0);
    }
    this.addPackage();
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();
    const type = data.type;
    console.log('Submitting ticket data:', type);
    if (type === 'entry') {
      this.Service.createEntry(data).subscribe(() => this.close(true));
    } else if (type === 'sale') {
      this.Service.createSale(data).subscribe(() => this.close(true));
    } else if (type === 'removed') {
      this.Service.createRemoved(data).subscribe(() => this.close(true));
    } else if (type === 'change') {
      this.Service.createChange(data).subscribe(() => this.close(true));
    }
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
