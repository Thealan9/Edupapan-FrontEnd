import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehousemanPage } from './warehouseman.page';

const routes: Routes = [
  {
    path: '',
    component: WarehousemanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousemanPageRoutingModule {}
