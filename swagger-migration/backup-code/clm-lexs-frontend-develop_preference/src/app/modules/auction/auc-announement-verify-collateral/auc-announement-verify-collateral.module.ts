import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionModule } from '../auction.module';
import { AucAnnounementVerifyCollateralRoutingModule } from './auc-announement-verify-collateral-routing.module';
import { AucAnnounementVerifyCollateralComponent } from './auc-announement-verify-collateral.component';

@NgModule({
  declarations: [AucAnnounementVerifyCollateralComponent],
  imports: [
    CommonModule,
    AucAnnounementVerifyCollateralRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    AuctionModule,
  ],
})
export class AucAnnounementVerifyCollateralModule {}
