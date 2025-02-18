import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionModule } from '../auction.module';
import { AucAnnounementMapCollateralRoutingModule } from './auc-announement-map-collateral-routing.module';
import { AucAnnounementMapCollateralComponent } from './auc-announement-map-collateral.component';

@NgModule({
  declarations: [AucAnnounementMapCollateralComponent],
  imports: [
    CommonModule,
    AucAnnounementMapCollateralRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    AuctionModule,
  ],
})
export class AucAnnounementMapCollateralModule {}
