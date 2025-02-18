import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionPropertyDetailRoutingModule } from './auction-property-detail-routing.module';
import { AuctionPropertyDetailComponent } from './auction-property-detail.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionModule } from '../../auction.module';
@NgModule({
  declarations: [AuctionPropertyDetailComponent],
  imports: [
    CommonModule,
    AuctionPropertyDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    AuctionModule,
  ],
})
export class AuctionPropertyDetailModule {}
