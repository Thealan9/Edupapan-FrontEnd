import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, MaxLengthValidator, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AdminBooks } from 'src/app/admin/services/admin-books';
import { Book } from 'src/app/interfaces/admin/book.model';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss'],
  standalone: false,
})
export class CreateEditComponent  implements OnInit {
@Input() data?: Book;

  isEdit = false;

  form = this.fb.group({
    title: ['',[Validators.required,Validators.maxLength(255)],],
    isbn: ['',[Validators.required, Validators.minLength(13),Validators.maxLength(13)],],
    level: ['',[Validators.required],],
    price: [0,[Validators.required, Validators.min(0)],],
    supplier: ['',[Validators.required,Validators.maxLength(255)],],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private Service: AdminBooks,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue() as Partial<Book>;

    if (this.isEdit) {
      this.Service.updateBook(this.data!.id, data).subscribe(() =>
        this.close(true),
      );
    } else {
      this.Service.createBook(data).subscribe(() => this.close(true));
    }
  }

  close(refresh = false) {
    this.modalCtrl.dismiss({ refresh });
  }

}
