import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationInDetailPageRoutingModule } from './location-in-detail-routing.module';
import { LocationInDetailPage } from './location-in-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationInDetailPageRoutingModule
  ],
  declarations: [LocationInDetailPage]
})
export class LocationInDetailPageModule {}
