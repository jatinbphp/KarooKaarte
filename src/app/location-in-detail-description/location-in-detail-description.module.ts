import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationInDetailDescriptionPageRoutingModule } from './location-in-detail-description-routing.module';

import { LocationInDetailDescriptionPage } from './location-in-detail-description.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationInDetailDescriptionPageRoutingModule
  ],
  declarations: [LocationInDetailDescriptionPage]
})
export class LocationInDetailDescriptionPageModule {}
