import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChaptersComponent } from './list-chapters/list-chapters.component';

const routes: Routes = [
  {
    path: 'chapters',
    component: ListChaptersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
