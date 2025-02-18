import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferenceCaseInfoComponent } from './preference-case-info.component';
import { PREFERENCE_CASE_TABS_INFO } from '@app/shared/constant';

const routes: Routes = [{
  path: '',
      component: PreferenceCaseInfoComponent,
      children: [
        {
          path: PREFERENCE_CASE_TABS_INFO[0].path,
          loadChildren: () =>
            import('../../../../modules/preference/preference-lawsuit/preference-command-info/preference-command-info.module').then(m => m.PreferenceCommandInfoModule),
        },
        {
          path: PREFERENCE_CASE_TABS_INFO[1].path,
          loadChildren: () => import('../../../../modules/preference/preference-lawsuit/preference-complaint/preference-complaint.module').then(m => m.PreferenceComplaintModule),
        },
        {
          path: PREFERENCE_CASE_TABS_INFO[2].path,
          loadChildren: () => import('../../../../modules/preference/preference-lawsuit/preference-judge/preference-judge.module').then(m => m.PreferenceJudgeModule),
        },
        {
          path: PREFERENCE_CASE_TABS_INFO[3].path,
          loadChildren: () => import('../../../../modules/preference/preference-lawsuit/preference-court-order/preference-court-order.module').then(m => m.PreferenceCourtOrderModule),
        },
        {
          path: PREFERENCE_CASE_TABS_INFO[4].path,
          loadChildren: () => import('../../../../modules/preference/preference-lawsuit/preference-auction-led-card/preference-auction-led-card.module').then(m => m.PreferenceAuctionLedCardModule),
        },
        {
          path: PREFERENCE_CASE_TABS_INFO[5].path,
          loadChildren: () => import('../../../../modules/preference/preference-lawsuit/preference-document-led/preference-document-led.module').then(m => m.PreferenceDocumentLedModule),
        },
      ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceCaseInfoRoutingModule { }
