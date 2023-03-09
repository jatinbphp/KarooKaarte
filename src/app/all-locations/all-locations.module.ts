import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllLocationsPageRoutingModule } from './all-locations-routing.module';

import { AllLocationsPage } from './all-locations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllLocationsPageRoutingModule
  ],
  declarations: [AllLocationsPage]
})
export class AllLocationsPageModule {}
