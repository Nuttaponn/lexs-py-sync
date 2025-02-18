import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionConclusionHistoryRoutingModule } from './auction-conclusion-history-routing.module';
import { AuctionConclusionHistoryComponent } from './auction-conclusion-history.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionGroupCollateralModule } from '../auction-group-collateral/auction-group-collateral.module';
@NgModule({
  declarations: [AuctionConclusionHistoryComponent],
  imports: [
    CommonModule,
    AuctionConclusionHistoryRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    AuctionGroupCollateralModule,
  ],
})
export class AuctionConclusionHistoryModule {}
