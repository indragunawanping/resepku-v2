import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResultMenuPage } from './search-result-menu.page';

const routes: Routes = [
  {
    path: '',
    component: SearchResultMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultMenuPageRoutingModule {}
