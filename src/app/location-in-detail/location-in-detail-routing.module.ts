import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationInDetailPage } from './location-in-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LocationInDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationInDetailPageRoutingModule {}
