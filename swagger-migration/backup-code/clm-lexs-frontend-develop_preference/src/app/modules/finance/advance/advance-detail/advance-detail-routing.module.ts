import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceDetailComponent } from './advance-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdvanceDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvanceDetailRoutingModule {}
