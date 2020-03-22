import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { BerandaPage } from './beranda/beranda.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'beranda',
        children: [
          {
            path: '',
            loadChildren: './beranda/beranda.module#BerandaPageModule',
          }
        ]
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: './history/history.module#HistoryPageModule'
          }
        ]
      },
      {
        path: 'bookmark',
        children: [
          {
            path: '',
            loadChildren: './bookmark/bookmark.module#BookmarkPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/beranda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/beranda',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
