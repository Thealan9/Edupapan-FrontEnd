import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalsPage } from './locals.page';

const routes: Routes = [
  {
    path: '',
    component: LocalsPage
  },  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalsPageRoutingModule {}
