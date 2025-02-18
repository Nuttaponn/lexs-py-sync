import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceResolver } from '../finance.resolver';
import { AdvanceDetailResolver } from './advance-detail/advance-detail.resolver';
import { AdvanceComponent } from './advance.component';

const routes: Routes = [
  {
    path: '',
    component: AdvanceComponent,
    data: {
      financeMode: 'ADVANCE',
    },
    resolve: {
      finance: FinanceResolver,
    },
  },
  {
    path: 'detail',
    loadChildren: () => import('./advance-detail/advance-detail.module').then(m => m.AdvanceDetailModule),
    resolve: { advance: AdvanceDetailResolver },
  },
  {
    path: 'audit-log',
    loadChildren: () => import('../finance-audit-log/finance-audit-log.module').then(m => m.FinanceAuditLogModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvanceRoutingModule {}
