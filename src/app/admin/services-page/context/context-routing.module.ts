import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContextPage } from './context.page';

const routes: Routes = [
  {
    path: '',
    component: ContextPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContextPageRoutingModule {}
