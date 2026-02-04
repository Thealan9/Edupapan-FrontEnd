import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContextPageRoutingModule } from './context-routing.module';

import { ContextPage } from './context.page';
import { ContextModalComponent } from '../components/context-modal/context-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContextPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ContextPage,ContextModalComponent]
})
export class ContextPageModule {}
