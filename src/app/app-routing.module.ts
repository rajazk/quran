import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChaptersComponent } from './list-chapters/list-chapters.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SurahInfoComponent } from './surah-info/surah-info.component';

const routes: Routes = [
  {
    path: '',
    component: ListChaptersComponent
  },
  // {
  //   path: '',
  //   component: SidebarComponent
  // },
  {
    path: 'surah/:id/info',
    component: SurahInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
