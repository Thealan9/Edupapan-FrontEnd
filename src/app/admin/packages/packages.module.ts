import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackagesPageRoutingModule } from './packages-routing.module';

import { PackagesPage } from './packages.page';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackagesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PackagesPage,EditComponent]
})
export class PackagesPageModule {}
