import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammeAnyPageRoutingModule } from './programme-any-routing.module';

import { ProgrammeAnyPage } from './programme-any.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgrammeAnyPageRoutingModule
  ],
  declarations: [ProgrammeAnyPage]
})
export class ProgrammeAnyPageModule {}
