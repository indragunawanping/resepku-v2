import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BerandaPage } from './beranda.page';

const routes: Routes = [
  {
    path: '',
    component: BerandaPage
  }
  // {
  //   path: 'search',
  //   loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BerandaPageRoutingModule {}
