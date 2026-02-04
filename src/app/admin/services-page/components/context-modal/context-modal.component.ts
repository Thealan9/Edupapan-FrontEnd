import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminContexts } from 'src/app/admin/services/admin-contexts';
import { AdminServices } from 'src/app/admin/services/admin-services';
import { ServiceContext } from 'src/app/interfaces/admin/serviceContext.model';

@Component({
  selector: 'app-context-modal',
  templateUrl: './context-modal.component.html',
  styleUrls: ['./context-modal.component.scss'],
  standalone: false,
})
export class ContextModalComponent implements OnInit {
  @Input() serviceId!: number;
  @Input() context?: ServiceContext;

  isEdit = false;

  form = this.fb.group({
    context: ['public', Validators.required],
    local_id: [null as number | null],
    price_override: [null as number | null],
    active: [true],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private adminServices: AdminContexts
  ) {}

  ngOnInit() {
    if (this.context) {
      this.isEdit = true;

      this.form.patchValue(this.context);

      this.form.get('context')?.disable();
    }

    this.handleContextChanges();
  }

  handleContextChanges() {
    this.form.get('context')?.valueChanges.subscribe((value) => {
      if (value === 'local') {
        this.form.get('local_id')?.setValidators([Validators.required]);
      } else {
        this.form.get('local_id')?.clearValidators();
        this.form.get('local_id')?.setValue(null);
      }

      this.form.get('local_id')?.updateValueAndValidity();
    });
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    if (this.isEdit) {
      this.update(data);
    } else {
      this.create(data);
    }
  }

  create(data: any) {
    this.adminServices
      .createContext(this.serviceId, data)
      .subscribe(() => this.close(true));
  }

  update(data: any) {
    this.adminServices
      .updateContext(this.context!.id, data)
      .subscribe(() => this.close(true));
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }
}
