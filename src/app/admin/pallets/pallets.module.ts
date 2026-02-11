import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PalletsPageRoutingModule } from './pallets-routing.module';

import { PalletsPage } from './pallets.page';
import { CreateEditComponent } from './components/create-edit/create-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PalletsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PalletsPage,CreateEditComponent]
})
export class PalletsPageModule {}
