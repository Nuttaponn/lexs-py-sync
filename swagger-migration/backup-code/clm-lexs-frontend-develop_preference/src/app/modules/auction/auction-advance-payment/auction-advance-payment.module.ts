import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionAdvancePaymentRoutingModule } from './auction-advance-payment-routing.module';
import { AuctionAdvancePaymentComponent } from './auction-advance-payment/auction-advance-payment.component';
import { AuctionIncreadsedLimitComponent } from './auction-increadsed-limit/auction-increadsed-limit.component';
import { AuctionOfficerOrderComponent } from './auction-officer-order/auction-officer-order.component';
import { AuctionPaymentEfilingComponent } from './auction-payment-efiling/auction-payment-efiling.component';
import { AuctionReceiptEfilingComponent } from './auction-receipt-efiling/auction-receipt-efiling.component';
import { AuctionIncreadsedLimitNonEfilingComponent } from './auction-increadsed-limit-non-efiling/auction-increadsed-limit-non-efiling.component';
import { AuctionOfficerOrderNonEfilingComponent } from './auction-officer-order-non-efiling/auction-officer-order-non-efiling.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    AuctionAdvancePaymentComponent,
    AuctionIncreadsedLimitComponent,
    AuctionOfficerOrderComponent,
    AuctionPaymentEfilingComponent,
    AuctionReceiptEfilingComponent,
    AuctionIncreadsedLimitNonEfilingComponent,
    AuctionOfficerOrderNonEfilingComponent,
  ],
  imports: [
    CommonModule,
    AuctionAdvancePaymentRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [DecimalPipe, provideNgxMask()],
})
export class AuctionAdvancePaymentModule {}
