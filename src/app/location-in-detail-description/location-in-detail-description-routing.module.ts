import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationInDetailDescriptionPage } from './location-in-detail-description.page';

const routes: Routes = [
  {
    path: '',
    component: LocationInDetailDescriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationInDetailDescriptionPageRoutingModule {}
