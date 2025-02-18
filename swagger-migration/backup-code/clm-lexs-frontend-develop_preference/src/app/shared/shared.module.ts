import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { AucitonPaymentResultComponent } from './components/auciton-payment-result/auciton-payment-result.component';
import { AuctionDetailLedCollateralTableComponent } from './components/auction-detail-led-collateral-table/auction-detail-led-collateral-table.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EFilingToReceiptDialogComponent } from './components/common-dialogs/e-filing-to-receipt-dialog/e-filing-to-receipt-dialog.component';
import { RejectDialogComponent } from './components/common-dialogs/reject-dialog/reject-dialog.component';
import { ConfigurationMatchingComponent } from './components/configuration-matching/configuration-matching.component';
import { MultiUserMatchDialogComponent } from './components/configuration-matching/multi-user-match-dialog/multi-user-match-dialog.component';
import { DownloadCopyDialogComponent } from './components/document-preparation/download-copy-dialog/download-copy-dialog.component';
import { RejectOriginalCopyDialogComponent } from './components/document-preparation/reject-original-copy-dialog/reject-original-copy-dialog.component';
import { ExternalDocumentsSearchControllerComponent } from './components/external-documents-search-controller/external-documents-search-controller.component';
import { GenaralDetailComponent } from './components/genaral-detail/genaral-detail.component';
import { MessageBannerComponent } from './components/message-banner/message-banner.component';
import { MessageEmptyComponent } from './components/message-empty/message-empty.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SearchControllerComponent } from './components/search-controller/search-controller.component';
import { FinancialCreditNoteTableComponent } from './components/summary-reimbursement/financial-credit-note-table/financial-credit-note-table.component';
import { FinancialCustomerSummaryTableComponent } from './components/summary-reimbursement/financial-customer-summary-table/financial-customer-summary-table.component';
import { SummaryReimbursementTableComponent } from './components/summary-reimbursement/summary-reimbursement-table/summary-reimbursement-table.component';
import { SummaryReimbursementComponent } from './components/summary-reimbursement/summary-reimbursement.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { UploadFileAmountTableComponent } from './components/upload-file-amount-table/upload-file-amount-table.component';
import { UploadFileContentComponent } from './components/upload-file-content/upload-file-content.component';
import { UploadFileDropdownComponent } from './components/upload-file-dropdown/upload-file-dropdown.component';
import { UploadFileTableAutoIncrementComponent } from './components/upload-file-table-auto-increment/upload-file-table-auto-increment.component';
import { UploadMultiFileContentComponent } from './components/upload-multi-file-content/upload-multi-file-content.component';
import { BadgeStatusDirective, IdCardDirective, TableScrollDirective } from './directives';
import { ColumnElevationLeftDirective } from './directives/column-elevation-left/column-elevation-left.directive';
import { ColumnElevationRightDirective } from './directives/column-elevation-right/column-elevation-right.directive';
import { PipesModule } from './pipes/pipes.module';
import { RefNoInputDirective } from './directives/ref-no/ref-no.directive';
import { ConfirmDialogComponent } from './components/common-dialogs/confirm-dialog/confirm-dialog.component';
import { LitigationInvestigatePropertyComponent } from './components/common-tabs/litigation-investigate-property/litigation-investigate-property.component';
import { DocumentListDialogComponent } from './components/common-dialogs/document-list-dialog/document-list-dialog.component';
import { LawsuitDetailHeadComponent } from './components/lawsuit-detail-head/lawsuit-detail-head.component';
import { SectionDownloadExpenseReportComponent } from '@app/shared/components/section-download-expense-report/section-download-expense-report.component';
import { LawDetailsComponent } from './components/law-details/law-details.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    MessageBannerComponent,
    MessageEmptyComponent,
    SearchControllerComponent,
    TooltipComponent,
    IdCardDirective,
    UploadFileContentComponent,
    UploadMultiFileContentComponent,
    ConfigurationMatchingComponent,
    MultiUserMatchDialogComponent,
    UploadFileAmountTableComponent,
    RejectDialogComponent,
    UploadFileTableAutoIncrementComponent,
    SummaryReimbursementTableComponent,
    FinancialCustomerSummaryTableComponent,
    FinancialCreditNoteTableComponent,
    SummaryReimbursementComponent,
    RejectOriginalCopyDialogComponent,
    PaginatorComponent,
    BadgeStatusDirective,
    ExternalDocumentsSearchControllerComponent,
    TableScrollDirective,
    ColumnElevationLeftDirective,
    ColumnElevationRightDirective,
    GenaralDetailComponent,
    DownloadCopyDialogComponent,
    CalendarComponent,
    UploadFileDropdownComponent,
    EFilingToReceiptDialogComponent,
    UploadFileDropdownComponent,
    AuctionDetailLedCollateralTableComponent,
    AucitonPaymentResultComponent,
    RefNoInputDirective,
    ConfirmDialogComponent,
    LitigationInvestigatePropertyComponent,
    DocumentListDialogComponent,
    LawsuitDetailHeadComponent,
    SectionDownloadExpenseReportComponent,
    LawDetailsComponent,
  ],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, OverlayModule, PipesModule],
  exports: [
    ActionBarComponent,
    MessageBannerComponent,
    MessageEmptyComponent,
    SearchControllerComponent,
    TooltipComponent,
    IdCardDirective,
    UploadFileContentComponent,
    UploadMultiFileContentComponent,
    ConfigurationMatchingComponent,
    MultiUserMatchDialogComponent,
    UploadFileAmountTableComponent,
    UploadFileTableAutoIncrementComponent,
    SummaryReimbursementTableComponent,
    FinancialCustomerSummaryTableComponent,
    FinancialCreditNoteTableComponent,
    SummaryReimbursementComponent,
    PaginatorComponent,
    BadgeStatusDirective,
    GenaralDetailComponent,
    ExternalDocumentsSearchControllerComponent,
    TableScrollDirective,
    ColumnElevationLeftDirective,
    ColumnElevationRightDirective,
    CalendarComponent,
    UploadFileDropdownComponent,
    UploadFileDropdownComponent,
    AuctionDetailLedCollateralTableComponent,
    AucitonPaymentResultComponent,
    RefNoInputDirective,
    LawsuitDetailHeadComponent,
    SectionDownloadExpenseReportComponent,
    LawDetailsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
