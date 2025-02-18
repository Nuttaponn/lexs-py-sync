import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LITIGATION_PROCESS_INFO_TABS_INFO } from '@app/shared/constant';
import { LitigationProcessInfoComponent } from './litigation-process-info.component';

const routes: Routes = [
  {
    path: '',
    component: LitigationProcessInfoComponent,
    children: [
      {
        path: LITIGATION_PROCESS_INFO_TABS_INFO[0].path,
        loadChildren: () =>
          import('../../debt-related-info-tab/debt-related-info-tab.module').then(m => m.DebtRelatedInfoTabModule),
      },
      {
        path: LITIGATION_PROCESS_INFO_TABS_INFO[1].path,
        loadChildren: () =>
          import('../../common-tabs/account-and-debt/account-and-debt.module').then(m => m.AccountAndDebtModule),
      },
      {
        path: LITIGATION_PROCESS_INFO_TABS_INFO[2].path,
        loadChildren: () =>
          import('../../common-tabs/collateral-info/collateral-info.module').then(m => m.CollateralInfoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LitigationProcessInfoRoutingModule {}
