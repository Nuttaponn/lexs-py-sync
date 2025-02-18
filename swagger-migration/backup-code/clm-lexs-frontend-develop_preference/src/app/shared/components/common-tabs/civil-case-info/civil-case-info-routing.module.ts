import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CIVIL_CASE_TABS_INFO } from '@app/shared/constant';
import { CivilCaseInfoComponent } from './civil-case-info.component';

const routes: Routes = [
  {
    path: '',
    component: CivilCaseInfoComponent,
    children: [
      {
        path: CIVIL_CASE_TABS_INFO[0].path,
        loadChildren: () =>
          import('../../common-tabs/prepare-lawsuit/prepare-lawsuit.module').then(m => m.PrepareLawsuitModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[1].path,
        loadChildren: () => import('../../common-tabs/suit-efiling/suit-efiling.module').then(m => m.SuitEfilingModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[2].path,
        loadChildren: () => import('../../common-tabs/trial/trial.module').then(m => m.TrialModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[3].path,
        loadChildren: () => import('../../../../modules/court/court.module').then(m => m.CourtModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[4].path,
        loadChildren: () => import('../execution-info/execution-info.module').then(m => m.ExecutionInfoModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[5].path,
        loadChildren: () =>
          import('../seizure-property-info/seizure-property-info.module').then(m => m.SeizurePropertyInfoModule),
      },
      {
        path: CIVIL_CASE_TABS_INFO[6].path,
        loadChildren: () => import('../auction-led-card/auction-led-card.module').then(m => m.AuctionLedCardModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CivilCaseInfoRoutingModule {}
