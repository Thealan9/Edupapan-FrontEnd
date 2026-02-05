import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WarehousemanPageRoutingModule } from './warehouseman-routing.module';

import { WarehousemanPage } from './warehouseman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WarehousemanPageRoutingModule
  ],
  declarations: [WarehousemanPage]
})
export class WarehousemanPageModule {}
