import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'credits', loadChildren: './credits/credits.module#CreditsPageModule' },
  { path: 'tabs/beranda/:menuType', loadChildren: './menu/menus/menus.module#MenusPageModule' },
  { path: 'tabs/beranda/:menuType/:menuIndex', loadChildren: './menu/menu-detail/menu-detail.module#MenuDetailPageModule' }

  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  // {
  //   path: 'beranda',
  //   loadChildren: () => import('./tabs/beranda/beranda.module').then( m => m.BerandaPageModule)
  // },
  // {
  //   path: 'bookmark',
  //   loadChildren: () => import('./tabs/bookmark/bookmark.module').then( m => m.BookmarkPageModule)
  // },
  // {
  //   path: 'history',
  //   loadChildren: () => import('./tabs/history/history.module').then( m => m.HistoryPageModule)
  // },
  // {
  //   path: 'menus',
  //   loadChildren: () => import('./menu/menus/menus.module').then( m => m.MenusPageModule)
  // },
  // {
  //   path: 'menu-detail',
  //   loadChildren: () => import('./menu/menu-detail/menu-detail.module').then( m => m.MenuDetailPageModule)
  // },
  // {
  //   path: 'credits',
  //   loadChildren: () => import('./credits/credits.module').then( m => m.CreditsPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
