import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryReimbursementComponent } from '@app/shared/components/summary-reimbursement/summary-reimbursement.component';
import { FinanceResolver } from '../finance.resolver';
import { ExpenseDetailViewComponent } from './expense-detail-view/expense-detail-view.component';
import { ExpenseComponent } from './expense.component';
import { ExpenseResolver } from './expense.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent,
    data: {
      financeMode: 'EXPENSE',
    },
    resolve: {
      finance: FinanceResolver,
    },
  },
  {
    path: 'detail',
    loadChildren: () => import('./expense-detail/expense-detail.module').then(m => m.ExpenseDetailModule),
    resolve: {
      expense: ExpenseResolver,
    },
  },
  {
    path: 'detail/reimbursement',
    component: SummaryReimbursementComponent,
    data: {
      financeMode: 'REIMBURSEMENT',
      isShowActionBar: true,
    },
    resolve: { finance: FinanceResolver },
  },
  {
    path: 'audit-log',
    loadChildren: () => import('../finance-audit-log/finance-audit-log.module').then(m => m.FinanceAuditLogModule),
  },
  {
    path: 'detail/expense-detail-view',
    component: ExpenseDetailViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule {}
