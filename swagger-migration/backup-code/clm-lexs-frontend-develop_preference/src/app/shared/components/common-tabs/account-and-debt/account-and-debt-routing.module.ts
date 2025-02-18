import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAndDebtComponent } from './account-and-debt.component';

const routes: Routes = [
  {
    path: '',
    component: AccountAndDebtComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountAndDebtRoutingModule {}
