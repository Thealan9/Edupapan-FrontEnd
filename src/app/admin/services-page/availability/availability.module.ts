import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailabilityPageRoutingModule } from './availability-routing.module';

import { AvailabilityPage } from './availability.page';
import { AvailabilityModalComponent } from '../components/availability-modal/availability-modal.component';
import { AvailabilityModalRangeComponent } from '../components/availability-modal-range/availability-modal-range.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailabilityPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AvailabilityPage,AvailabilityModalComponent,AvailabilityModalRangeComponent]
})
export class AvailabilityPageModule {}
