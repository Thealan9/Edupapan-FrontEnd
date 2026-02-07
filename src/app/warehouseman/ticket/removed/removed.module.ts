import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemovedPageRoutingModule } from './removed-routing.module';

import { RemovedPage } from './removed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemovedPageRoutingModule
  ],
  declarations: [RemovedPage]
})
export class RemovedPageModule {}
