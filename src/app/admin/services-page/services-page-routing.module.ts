import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPagePage } from './services-page.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesPagePage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  },  {
    path: 'availability',
    loadChildren: () => import('./availability/availability.module').then( m => m.AvailabilityPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPagePageRoutingModule {}
