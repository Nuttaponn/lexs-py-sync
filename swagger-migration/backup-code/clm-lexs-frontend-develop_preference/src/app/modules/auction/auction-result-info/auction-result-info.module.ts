import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionResultInfoRoutingModule } from './auction-result-info-routing.module';
import { AuctionResultInfoComponent } from './auction-result-info.component';
import { AuctionGroupCollateralModule } from '../auction-group-collateral/auction-group-collateral.module';
import { AuctionProcessingDocumentComponent } from '../auction-processing-document/auction-processing-document.component';

@NgModule({
  declarations: [AuctionResultInfoComponent, AuctionProcessingDocumentComponent],
  imports: [
    CommonModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    AuctionResultInfoRoutingModule,
    AuctionGroupCollateralModule,
  ],
})
export class AuctionResultInfoModule {}
