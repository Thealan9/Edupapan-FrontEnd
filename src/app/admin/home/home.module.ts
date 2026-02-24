import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { CreateComponent } from './components/create/create.component';
import { RequestPartialComponent } from './components/request-partial/request-partial.component';
import { SolutionPackageComponent } from './components/solution-package/solution-package.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,

  ],
  declarations: [HomePage, CreateComponent,RequestPartialComponent,SolutionPackageComponent,AlertComponent]
})
export class HomePageModule {}
