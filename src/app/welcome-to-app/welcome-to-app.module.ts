import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeToAppPageRoutingModule } from './welcome-to-app-routing.module';

import { WelcomeToAppPage } from './welcome-to-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeToAppPageRoutingModule
  ],
  declarations: [WelcomeToAppPage]
})
export class WelcomeToAppPageModule {}
