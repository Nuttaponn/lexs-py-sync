import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDirectComponent } from './profile-direct.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileDirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileDirectRoutingModule {}
