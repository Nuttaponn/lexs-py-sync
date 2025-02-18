import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatStepperModule } from '@angular/material/stepper';
import { CaseDetailsModule } from '@app/shared/components/case-details/case-details.module';
import { DocumentPreparationModule } from '@app/shared/components/document-preparation/document-preparation/document-preparation.module';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AucAnnounementVerifyCollateralDetailComponent } from './auc-announement-verify-collateral-detail/auc-announement-verify-collateral-detail.component';
import { AuctionDetailDateComponent } from './auction-detail-date/auction-detail-date.component';
import { AuctionExpendTimeDialogComponent } from '@shared/components/auciton-payment-result/auction-expend-time-dialog/auction-expend-time-dialog.component';
import { AuctionDocumentSubmittedComponent } from './auction-document-submitted/auction-document-submitted.component';
import { AuctionHeaderComponent } from './auction-header/auction-header.component';
import { AuctionPropertyComponent } from './auction-property-list/auction-property/auction-property.component';
import { AuctionResultComponent } from './auction-result/auction-result.component';
import { AuctionRoutingModule } from './auction-routing.module';
import { AuctionSeizureDocumentDetailComponent } from './auction-seizure-document-detail/auction-seizure-document-detail.component';
import { AuctionSeizureDocumentComponent } from './auction-seizure-document-detail/auction-seizure-document/auction-seizure-document.component';
import { AuctionComponent } from './auction.component';
import { RejectAuctionCashierChequeDialogComponent } from './reject-auction-cashier-cheque-dialog/reject-auction-cashier-cheque-dialog.component';
import { SubmitCancelMatchingDialogComponent } from './submit-cancel-matching-dialog/submit-cancel-matching-dialog.component';
import { SubmitEditAnnouncementDialogComponent } from './submit-edit-announcement-dialog/submit-edit-announcement-dialog.component';
import { SubmitReleaseAnnouncementDialogComponent } from './submit-release-announcement-dialog/submit-release-announcement-dialog.component';
import { SubmitResultNonebuyerDialogComponent } from './submit-result-nonebuyer-dialog/submit-result-nonebuyer-dialog.component';
import { SubmitResultSuspendSaleDialogComponent } from './submit-result-suspend-sale-dialog/submit-result-suspend-sale-dialog.component';
import { SuspendDetailTableComponent } from './suspend-detail-table/suspend-detail-table.component';
import { AuctionAppointmentDataComponent } from './auction-appointment-date/auction-appointment-data/auction-appointment-data.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AucAnnounementMatchDialogComponent } from './auc-announement-match-dialog/auc-announement-match-dialog.component';
import { AuctionManualAnnouncementModule } from './auction-manual-announcement/auction-manual-announcement.module';

@NgModule({
  declarations: [
    AuctionComponent,
    SuspendDetailTableComponent,
    SubmitResultNonebuyerDialogComponent,
    SubmitResultSuspendSaleDialogComponent,
    RejectAuctionCashierChequeDialogComponent,
    SubmitCancelMatchingDialogComponent,
    SubmitEditAnnouncementDialogComponent,
    SubmitReleaseAnnouncementDialogComponent,
    AucAnnounementVerifyCollateralDetailComponent,
    AuctionResultComponent,
    AuctionSeizureDocumentComponent,
    AuctionHeaderComponent,
    AuctionSeizureDocumentDetailComponent,
    AuctionDetailDateComponent,
    AuctionPropertyComponent,
    AuctionDocumentSubmittedComponent,
    AuctionExpendTimeDialogComponent,
    AuctionAppointmentDataComponent,
    AucAnnounementMatchDialogComponent,
  ],
  imports: [
    CommonModule,
    AuctionRoutingModule,
    SpigCoreModule,
    SpigShareModule,
    TranslateModule,
    SharedModule,
    PipesModule,
    CaseDetailsModule,
    MatStepperModule,
    DocumentPreparationModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AuctionManualAnnouncementModule,
  ],
  exports: [
    SuspendDetailTableComponent,
    SubmitResultNonebuyerDialogComponent,
    SubmitResultSuspendSaleDialogComponent,
    AucAnnounementVerifyCollateralDetailComponent,
    AuctionResultComponent,
    AuctionSeizureDocumentComponent,
    AuctionHeaderComponent,
    AuctionDetailDateComponent,
    AuctionPropertyComponent,
    AuctionDocumentSubmittedComponent,
    AuctionAppointmentDataComponent,
    AucAnnounementMatchDialogComponent
  ],
  providers: [provideNgxMask()],
})
export class AuctionModule {}
