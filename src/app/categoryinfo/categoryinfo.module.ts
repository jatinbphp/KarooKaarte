import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryinfoPageRoutingModule } from './categoryinfo-routing.module';

import { CategoryinfoPage } from './categoryinfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryinfoPageRoutingModule
  ],
  declarations: [CategoryinfoPage]
})
export class CategoryinfoPageModule {}
