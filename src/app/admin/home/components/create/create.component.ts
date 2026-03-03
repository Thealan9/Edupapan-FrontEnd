import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminTickets } from 'src/app/admin/services/admin-tickets';
import { finalize } from 'rxjs/operators';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: false,
})
export class CreateComponent implements OnInit {
  @Input() data?: any;

  loading = true;
  workers: any[] = [];
  pallets: any[] = [];
  books: any[] = [];
  packagesData: any[] = [];
  isSubmitting = false;

  form = this.fb.group({
    type: ['', Validators.required],
    assigned_to: ['', [Validators.required]],
    book_id: [0],
    quantity: [0, [Validators.required, Validators.min(1)]],
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
        this.managePackages();
      }
    });

    this.form.get('book_id')?.valueChanges.subscribe(() => {
    this.clearPackageSelections();
});

    this.form.get('quantity')?.valueChanges.subscribe((val) => {
      if (val !== null && val >= 0) {
        this.generatePackageForms(val);
      }
    });

    this.load();
    this.Service.refresh$.subscribe(() => {
      this.load();
    });
  }

  load() {
    this.loading = true;
    this.Service.get().subscribe({
      next: (res) => {
        this.workers = Object.entries(res.workers).map(([name, id]) => ({
          name,
          id,
        }));
        this.books = Object.entries(res.books).map(([title, id]) => ({
          title,
          id,
        }));
        this.packagesData = res.packages;
        this.pallets = res.pallets;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  get packages() {
    return this.form.get('packages') as FormArray;
  }
  resetPackages() {
    while (this.packages.length !== 0) {
      this.packages.removeAt(0);
    }
  }

  clearPackageSelections() {
    this.packages.controls.forEach((group: any) => {
      if (group.get('package_id')) group.get('package_id').setValue('');
      //if (group.get('batch_number')) group.get('batch_number').setValue('');
      if (group.get('moved_to_pallet')) group.get('moved_to_pallet').setValue('');
    });
  }

  palletFull(palletId: number): boolean {
    const pallet = this.pallets.find((p) => p.id === palletId);
    return pallet ? pallet.remaining_capacity <= 0 : false;
  }

  hasPackages(bookId: any): boolean {
  if (!bookId || bookId === 0) return false;
  return (this.packagesData?.[bookId]?.length ?? 0) > 0;
  }

  generatePackageForms(count: any) {
    const total = Number(count);
    if (isNaN(total) || total < 0) return;

    const currentLength = this.packages.length;

    if (total > currentLength) {
      for (let i = currentLength; i < total; i++) {
        this.addPackage();
      }
    } else if (total < currentLength) {
      for (let i = currentLength - 1; i >= total; i--) {
        this.removePackage(i);
      }
    }
  }
  getAvailableCapacity(palletId: number): number {
    const pallet = this.pallets.find((p) => p.id === palletId);
    if (!pallet) return 0;

    const selectedInForm = this.packages.value.filter(
      (p: any) => p.moved_to_pallet === palletId,
    ).length;

    return pallet.remaining_capacity - selectedInForm;
  }

  isPalletDisabled(palletId: number, currentSelectedPalletId: any): boolean {
    const pallet = this.pallets.find((p) => p.id === palletId);
    if (!pallet) return true;

    if (palletId === currentSelectedPalletId) return false;

    return this.getAvailableCapacity(palletId) <= 0;
  }
  isPackageDisabled(packageId: number, currentSelectedId: any): boolean {
    if (!packageId) return false;
    if (packageId === currentSelectedId) return false;

    return this.packages.value.some((p: any) => p.package_id === packageId);
  }

  addPackage() {
    const type = this.form.get('type')?.value;
    const packageGroup = this.fb.group({});

    if (type === 'sale') {
      packageGroup.addControl('book_id', this.fb.control('', Validators.required));
    }
    if (type === 'entry') {
      packageGroup.addControl(
        'batch_number',
        this.fb.control('', Validators.required),
      );
      packageGroup.addControl(
        'book_quantity',
        this.fb.control(20, [Validators.required, Validators.min(20)]),
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

    this.packages.insert(0, packageGroup);
  }

  increaseQuantity() {
    const current = this.form.get('quantity')?.value || 1;
    this.form.get('quantity')?.setValue(current + 1);
  }

  decreaseQuantity() {
    const current = this.form.get('quantity')?.value || 1;
    if (current > 1) {
      this.form.get('quantity')?.setValue(current - 1);
    }
  }
  get quantityValue(): number {
    return this.form.get('quantity')?.value ?? 1;
  }
  getFilteredPackages(bookId: any): any[] {
    if (!bookId || bookId === 0) return [];
    return this.packagesData[bookId] || [];
  }
  getCurrentPallet(packageId: number): number | null {
    if (!this.packagesData) return null;

    const allPackages: any[] = [].concat(
      ...(Object.values(this.packagesData) as any),
    );
    const pkg = allPackages.find((p: any) => p.id === packageId);

    return pkg ? pkg.pallet_id : null;
  }
  removePackage(index: number) {
    this.packages.removeAt(index);
  }

  removeSpecificPackage(index: number) {
    const currentQuantity = this.form.get('quantity')?.value || 0;

    this.packages.removeAt(index);

    if (currentQuantity > 0) {
      this.form.get('quantity')?.setValue(currentQuantity - 1, { emitEvent: false });
    }
  }

  managePackages() {
    this.form.get('quantity')?.setValue(1, { emitEvent: false });
    this.resetPackages();
    this.addPackage();
  }

  submit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.form.get('type')?.value !== 'entry') {
      const selectedPackageIds = this.packages.value.map(
        (p: any) => p.package_id,
      );
      const hasDuplicates =
        new Set(selectedPackageIds).size !== selectedPackageIds.length;
      if (hasDuplicates) {
        alert('No puedes seleccionar el mismo paquete varias veces.');
        return;
      }
    }

    if (this.form.invalid) return;

    const data = this.form.getRawValue();
    const type = data.type;
    if (data.type !== 'sale') {
      data.packages = data.packages.map((p: any) => ({
        ...p,
        book_id: data.book_id
      }));
    }
    if (type === 'entry') {
      this.Service.createEntry(data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else if (type === 'sale') {
      this.Service.createSale(data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else if (type === 'removed') {
      this.Service.createRemoved(data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    } else if (type === 'change') {
      this.Service.createChange(data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (res) => {this.close(true); this.showAlert(res.message, 'success')},
        error: (err) => {
          if (err.status === 409 || err.status === 422) {
            this.close(true);
            this.showAlert(err.error.message, 'warning');
          } else {
            this.close(true);
            this.showAlert('Oops, ocurrió un error!', 'error');
          }
        },
      });
    }
  }

  async showAlert(
    message: string,
    type: 'success' | 'error' | 'warning'
  ) {
    const modal = await this.modalCtrl.create({
      component: AlertComponent,
      componentProps: { message, type },
      cssClass: 'small-alert-modal',
      backdropDismiss: false,
    });

    await modal.present();
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
  onBookChange(index: number) {
  const pkg = this.packages.at(index);
  pkg.get('package_id')?.setValue('');
  pkg.get('moved_to_pallet')?.setValue('');
}
}
