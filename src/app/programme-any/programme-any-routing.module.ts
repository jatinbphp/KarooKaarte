import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammeAnyPage } from './programme-any.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammeAnyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammeAnyPageRoutingModule {}
