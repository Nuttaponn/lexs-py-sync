import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceResolver } from '../finance.resolver';
import { ReceiptDetailKcorpComponent } from './receipt-detail-kcorp/receipt-detail-kcorp.component';
import { ReceiptComponent } from './receipt.component';
import { ReceiptResolver } from './receipt.resolver';
import { ReferenceNoDetailComponent } from './reference-no-detail/reference-no-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptComponent,
    data: {
      financeMode: 'RECEIPT',
    },
    resolve: {
      finance: FinanceResolver,
    },
  },
  {
    path: 'detail',
    loadChildren: () => import('./receipt-detail/receipt-detail.module').then(m => m.ReceiptDetailModule),
    resolve: {
      receipt: ReceiptResolver,
    },
  },
  {
    path: 'audit-log',
    loadChildren: () => import('../finance-audit-log/finance-audit-log.module').then(m => m.FinanceAuditLogModule),
  },
  {
    path: 'kcorp-detail',
    component: ReceiptDetailKcorpComponent,
    resolve: {
      finance: ReceiptResolver,
    },
  },
  {
    path: 'reference-no',
    component: ReferenceNoDetailComponent,
    resolve: {
      finance: ReceiptResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptRoutingModule {}
