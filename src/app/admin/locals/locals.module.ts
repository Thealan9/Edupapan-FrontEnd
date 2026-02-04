import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalsPageRoutingModule } from './locals-routing.module';

import { LocalsPage } from './locals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalsPageRoutingModule
  ],
  declarations: [LocalsPage]
})
export class LocalsPageModule {}
