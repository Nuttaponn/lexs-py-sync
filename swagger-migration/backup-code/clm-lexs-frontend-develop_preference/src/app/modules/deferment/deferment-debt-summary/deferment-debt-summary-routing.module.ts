import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefermentDebtSummaryComponent } from './deferment-debt-summary.component';

const routes: Routes = [
  {
    path: '',
    component: DefermentDebtSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefermentDebtSummaryRoutingModule {}
