import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryinfoPage } from './categoryinfo.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryinfoPageRoutingModule {}
