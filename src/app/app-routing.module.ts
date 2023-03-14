import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome-to-app',//'folder/Inbox'
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'welcome-to-app',
    loadChildren: () => import('./welcome-to-app/welcome-to-app.module').then( m => m.WelcomeToAppPageModule)
  },
  {
    path: 'all-locations',
    loadChildren: () => import('./all-locations/all-locations.module').then( m => m.AllLocationsPageModule)
  },
  {
    path: 'location-in-detail',
    loadChildren: () => import('./location-in-detail/location-in-detail.module').then( m => m.LocationInDetailPageModule)
  },
  {
    path: 'all-categories',
    loadChildren: () => import('./all-categories/all-categories.module').then( m => m.AllCategoriesPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'location-in-detail-description',
    loadChildren: () => import('./location-in-detail-description/location-in-detail-description.module').then( m => m.LocationInDetailDescriptionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
