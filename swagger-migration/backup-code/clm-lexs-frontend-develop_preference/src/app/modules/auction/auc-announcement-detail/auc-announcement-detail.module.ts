import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AucAnnouncementDetailRoutingModule } from './auc-announcement-detail-routing.module';
import { AucAnnouncementDetailComponent } from './auc-announcement-detail.component';
import { AuctionDetailSummaryComponent } from '../auction-detail-summary/auction-detail-summary.component';
import { AuctionDetailLedCollateralComponent } from './auction-detail-led-collateral/auction-detail-led-collateral.component';
import { AddCollateralLexsDialogComponent } from './add-collateral-lexs-dialog/add-collateral-lexs-dialog.component';
import { ConfirmCollateralLexsDialogComponent } from './confirm-collateral-lexs-dialog/confirm-collateral-lexs-dialog.component';
import { DetailCollateralLexsDialogComponent } from './detail-collateral-lexs-dialog/detail-collateral-lexs-dialog.component';

@NgModule({
  declarations: [
    AucAnnouncementDetailComponent,
    AuctionDetailSummaryComponent,
    AuctionDetailLedCollateralComponent,
    AddCollateralLexsDialogComponent,
    DetailCollateralLexsDialogComponent,
    ConfirmCollateralLexsDialogComponent,
  ],
  imports: [
    CommonModule,
    AucAnnouncementDetailRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
  ],
  exports: [AuctionDetailSummaryComponent],
})
export class AucAnnouncementDetailModule {}
