import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AuctionLedCardAnnouncementTableComponent } from './auction-led-card-announcement-table/auction-led-card-announcement-table.component';
import { AuctionLEDCardAnnouncementComponent } from './auction-led-card-announcement/auction-led-card-announcement.component';
import { AuctionLEDCardExpenseComponent } from './auction-led-card-expense/auction-led-card-expense.component';
import { AuctionLedCardRoutingModule } from './auction-led-card-routing.module';
import { AuctionLEDCardSeizedCallateralsComponent } from './auction-led-card-seized-callaterals/auction-led-card-seized-callaterals.component';
import { AuctionLEDCardComponent } from './auction-led-card.component';
import { AuctionExpenseEfilingDialogComponent } from './auction-led-card-expense/auction-expense-efiling-dialog/auction-expense-efiling-dialog.component';
import { AuctionLedCardRevokeSaleComponent } from './auction-led-card-revoke-sale/auction-led-card-revoke-sale.component';
import { AuctionLedCardOrderTableComponent } from './auction-led-card-order-table/auction-led-card-order-table.component';
import { AuctionLedCardRevokeSaleDialogComponent } from './auction-led-card-revoke-sale-dialog/auction-led-card-revoke-sale-dialog.component';
import { AuctionLedCardOwnershipTransferComponent } from './auction-led-card-ownership-transfer/auction-led-card-ownership-transfer.component';
import { AuctionLedCardDebtPaymentComponent } from './auction-led-card-debt-payment/auction-led-card-debt-payment.component';
import { AuctionAnnouncementStatusPipe } from './auction-announcement-status.pipe';

@NgModule({
  declarations: [
    AuctionLEDCardComponent,
    AuctionLEDCardSeizedCallateralsComponent,
    AuctionLEDCardExpenseComponent,
    AuctionLEDCardAnnouncementComponent,
    AuctionLedCardAnnouncementTableComponent,
    AuctionExpenseEfilingDialogComponent,
    AuctionLedCardRevokeSaleComponent,
    AuctionLedCardOrderTableComponent,
    AuctionLedCardRevokeSaleDialogComponent,
    AuctionLedCardOwnershipTransferComponent,
    AuctionLedCardDebtPaymentComponent,
    AuctionAnnouncementStatusPipe,
  ],
  imports: [CommonModule, AuctionLedCardRoutingModule, SharedModule, TranslateModule, SpigShareModule, SpigCoreModule],
  exports: [
    AuctionLEDCardComponent,
    AuctionLEDCardSeizedCallateralsComponent,
    AuctionLEDCardAnnouncementComponent,
    AuctionLEDCardExpenseComponent,
    AuctionLedCardDebtPaymentComponent,
    AuctionLedCardOwnershipTransferComponent
  ],
})
export class AuctionLedCardModule {}
