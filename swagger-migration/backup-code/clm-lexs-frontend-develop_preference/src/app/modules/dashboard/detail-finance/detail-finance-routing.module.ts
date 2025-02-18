import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailFinanceComponent } from './detail-finance.component';

const routes: Routes = [
  {
    path: '',
    component: DetailFinanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFinanceRoutingModule {}
