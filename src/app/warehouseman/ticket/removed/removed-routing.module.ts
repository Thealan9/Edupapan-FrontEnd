import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemovedPage } from './removed.page';

const routes: Routes = [
  {
    path: '',
    component: RemovedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemovedPageRoutingModule {}
