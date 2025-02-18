import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CUSTOMER_TABS_INFO } from '@app/shared/constant';
import { CustomerGuard } from '../customer.guard';
import { CustomerDetailComponent } from './customer-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerDetailComponent,
    canDeactivate: [CustomerGuard],
    children: [
      {
        path: CUSTOMER_TABS_INFO[0].path,
        loadChildren: () =>
          import('../../../shared/components/debt-related-info-tab/debt-related-info-tab.module').then(
            m => m.DebtRelatedInfoTabModule
          ),
      },
      {
        path: CUSTOMER_TABS_INFO[1].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/account-info/account-info.module').then(
            m => m.AccountInfoModule
          ),
      },
      {
        path: CUSTOMER_TABS_INFO[2].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/collateral-info/collateral-info.module').then(
            m => m.CollateralInfoModule
          ),
      },
      {
        path: CUSTOMER_TABS_INFO[3].path,
        loadChildren: () =>
          import(
            '../../../shared/components/document-preparation/document-preparation/document-preparation.module'
          ).then(m => m.DocumentPreparationModule),
      },
      {
        path: CUSTOMER_TABS_INFO[4].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/case-info/case-info.module').then(m => m.CaseInfoModule),
      },
      {
        path: CUSTOMER_TABS_INFO[5].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/audit-log/audit-log.module').then(m => m.AuditLogModule),
      },
    ],
  },
  {
    path: 'account-detail',
    loadChildren: () =>
      import('../../../shared/components/account-detail/account-detail.module').then(m => m.AccountDetailModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerDetailRoutingModule {}
