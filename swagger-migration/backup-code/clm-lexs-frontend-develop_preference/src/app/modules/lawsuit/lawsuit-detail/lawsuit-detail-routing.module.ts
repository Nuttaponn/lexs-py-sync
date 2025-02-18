import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceResolver } from '@app/modules/finance/finance.resolver';
import { IndictmentGuard } from '@app/modules/task/guards/indictment.guard';
import { LAWSUIT_TABS_INFO } from '@app/shared/constant';
import { LawsuitGuard } from '../lawsuit.guard';
import { AddRelatedPersonLegalComponent } from './add-related-person-legal/add-related-person-legal.component';
import { LawsuitDetailComponent } from './lawsuit-detail.component';
import { IndictmentMainComponent } from './suit/indictment-main/indictment-main.component';
import { SuitResolver } from './suit/suit.resolver';

const routes: Routes = [
  {
    path: '',
    component: LawsuitDetailComponent,
    canDeactivate: [LawsuitGuard],
    children: [
      {
        path: LAWSUIT_TABS_INFO[0].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/litigation-case-info/litigation-case-info.module').then(
            m => m.LitigationCaseInfoModule
          ),
        data: {
          financeMode: 'REIMBURSEMENT',
          isShowActionBar: true,
        },
        resolve: { finance: FinanceResolver },
      },
      {
        path: LAWSUIT_TABS_INFO[1].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/litigation-process-info/litigation-process-info.module').then(
            m => m.LitigationProcessInfoModule
          ),
      },
      {
        path: LAWSUIT_TABS_INFO[2].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/civil-case-info/civil-case-info.module').then(
            m => m.CivilCaseInfoModule
          ),
      },
      {
        path: LAWSUIT_TABS_INFO[3].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/preference-case-info/preference-case-info.module').then(
            m => m.PreferenceCaseInfoModule
          ),
      },
      {
        path: LAWSUIT_TABS_INFO[4].path,
        loadChildren: () =>
          import(
            '../../../shared/components/common-tabs/litigation-investigate-property/litigation-investigate-property.module'
          ).then(m => m.LitigationInvestigatePropertyModule),
      },
      {
        path: LAWSUIT_TABS_INFO[5].path,
        loadChildren: () => import('./litigation-memo/litigation-memo.module').then(m => m.LitigationMemoModule),
      },
      {
        path: LAWSUIT_TABS_INFO[6].path,
        loadChildren: () =>
          import('../../../shared/components/common-tabs/audit-log/audit-log.module').then(m => m.AuditLogModule),
      },
    ],
  },
  { path: 'add-related-person-legal', component: AddRelatedPersonLegalComponent },
  {
    path: 'account-detail',
    loadChildren: () =>
      import('../../../shared/components/account-detail/account-detail.module').then(m => m.AccountDetailModule),
  },
  {
    path: 'suit-indictment',
    canDeactivate: [IndictmentGuard],
    component: IndictmentMainComponent,
    resolve: {
      litigationCase: SuitResolver,
    },
  },
  // { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LawsuitDetailRoutingModule {}
