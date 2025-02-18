import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnershipTransferRoutingModule } from './ownership-transfer-routing.module';
import { OwnershipTransferComponent } from './ownership-transfer.component';
import { SharedModule } from '@app/shared/shared.module';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { AuctionModule } from '../auction.module';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { TransferOwnershipDetailsComponent } from '../transfer-ownership-details/transfer-ownership-details.component';
import { AuctionAppointmentDetailsComponent } from '../auction-appointment-details/auction-appointment-details.component';

@NgModule({
  declarations: [OwnershipTransferComponent, TransferOwnershipDetailsComponent, AuctionAppointmentDetailsComponent],
  imports: [
    CommonModule,
    OwnershipTransferRoutingModule,
    SharedModule,
    CaseDetailsModule,
    AuctionModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    PipesModule,
    DocumentPreparationModule,
  ],
  exports: [AuctionAppointmentDetailsComponent],
})
export class OwnershipTransferModule {}
