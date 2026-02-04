import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesPagePageRoutingModule } from './services-page-routing.module';

import { ServicesPagePage } from './services-page.page';
import { CreateServiceModalComponent } from './components/create-service-modal/create-service-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesPagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ServicesPagePage,CreateServiceModalComponent]
})
export class ServicesPagePageModule {}
