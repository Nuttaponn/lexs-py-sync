import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionPropertySetBuyerRoutingModule } from './auction-property-set-buyer-routing.module';
import { AuctionPropertySetBuyerComponent } from './auction-property-set-buyer.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

@NgModule({
  declarations: [AuctionPropertySetBuyerComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    AuctionPropertySetBuyerRoutingModule,
  ],
  exports: [AuctionPropertySetBuyerComponent],
})
export class AuctionPropertySetBuyerModule {}
