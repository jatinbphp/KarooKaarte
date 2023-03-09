import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeToAppPage } from './welcome-to-app.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeToAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeToAppPageRoutingModule {}
