import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchResultMenuPageRoutingModule } from './search-result-menu-routing.module';

import { SearchResultMenuPage } from './search-result-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultMenuPageRoutingModule
  ],
  declarations: [SearchResultMenuPage]
})
export class SearchResultMenuPageModule {}
