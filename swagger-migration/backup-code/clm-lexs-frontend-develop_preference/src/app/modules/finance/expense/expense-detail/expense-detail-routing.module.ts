import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseGuard } from '../expense.guard';
import { ExpenseDetailComponent } from './expense-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseDetailComponent,
    canDeactivate: [ExpenseGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseDetailRoutingModule {}
