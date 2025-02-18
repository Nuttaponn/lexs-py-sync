import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AucAnnounementMapCollateralComponent } from './auc-announement-map-collateral.component';
import { AucAnnounementMapCollateralResolver } from './auc-announement-map-collateral.resolver';
import { AuctionGuard } from '../auction.guard';

const routes: Routes = [
  {
    path: '',
    component: AucAnnounementMapCollateralComponent,
    canDeactivate: [AuctionGuard],
    resolve: {
      aucAnnounceMap: AucAnnounementMapCollateralResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AucAnnounementMapCollateralRoutingModule {}
