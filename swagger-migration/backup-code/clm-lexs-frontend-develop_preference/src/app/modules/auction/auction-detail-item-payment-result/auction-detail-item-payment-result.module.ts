import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuctionModule } from '@modules/auction/auction.module';
import { TranslateModule } from '@ngx-translate/core';
import { CaseDetailsModule } from '@shared/components/case-details/case-details.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SharedModule } from '@shared/shared.module';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionDetailItemPaymentResultRoutingModule } from './auction-detail-item-payment-result-routing.module';
import { AuctionDetailItemPaymentResultComponent } from './auction-detail-item-payment-result.component';
import { AuctionDetailModule } from '@modules/auction/auction-detail/auction-detail.module';

@NgModule({
  declarations: [AuctionDetailItemPaymentResultComponent],
  imports: [
    CommonModule,
    AuctionDetailItemPaymentResultRoutingModule,
    PipesModule,
    TranslateModule,
    SharedModule,
    SpigShareModule,
    SpigCoreModule,
    CaseDetailsModule,
    AuctionModule,
    AuctionDetailModule,
  ],
})
export class AuctionDetailItemPaymentResultModule {}
