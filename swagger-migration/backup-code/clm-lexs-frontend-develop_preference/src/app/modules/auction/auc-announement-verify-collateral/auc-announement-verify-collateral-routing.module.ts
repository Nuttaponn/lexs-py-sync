import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AucAnnounementVerifyCollateralComponent } from './auc-announement-verify-collateral.component';
import { AuctionGuard } from '../auction.guard';

const routes: Routes = [
  {
    path: '',
    component: AucAnnounementVerifyCollateralComponent,
    canDeactivate: [AuctionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AucAnnounementVerifyCollateralRoutingModule {}
