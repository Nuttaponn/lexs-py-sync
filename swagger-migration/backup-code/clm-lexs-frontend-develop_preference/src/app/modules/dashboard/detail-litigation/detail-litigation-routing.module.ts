import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLitigationComponent } from './detail-litigation.component';

const routes: Routes = [
  {
    path: '',
    component: DetailLitigationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailLitigationRoutingModule {}
