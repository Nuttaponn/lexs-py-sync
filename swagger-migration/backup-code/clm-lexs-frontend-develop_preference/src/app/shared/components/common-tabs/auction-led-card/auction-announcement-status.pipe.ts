import { Pipe, PipeTransform } from '@angular/core';
import {
  AnnouncementCashierChequeStatus,
  AnnouncementExpenseStatus,
  AuctionStatus,
} from '@app/shared/constant/auction-matching-status.constant';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'auctionAnnouncementStatus',
})
export class AuctionAnnouncementStatusPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string): string {
    switch (value) {
      case AuctionStatus.NPA_SUBMIT:
      case AuctionStatus.APPRAISAL:
      case AuctionStatus.PROCEED:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.STATUS.NPA_SUBMIT');
      case AuctionStatus.NPA_RECEIVE:
      case AuctionStatus.ADJUST_SUBMIT:
      case AuctionStatus.AUCTION:
      case AuctionStatus.COMPLETE:
      case AuctionStatus.NPA_ADJUST:
      case AuctionStatus.PENDING_AUCTION:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.STATUS.' + value);
      case AnnouncementCashierChequeStatus.PENDING:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.CASHIER_CHEQUE_STATUS.PENDING');
      case AnnouncementCashierChequeStatus.CORRECT_PENDING:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.CASHIER_CHEQUE_STATUS.CORRECT_PENDING');
      case AnnouncementCashierChequeStatus.PENDING_APPROVAL:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.CASHIER_CHEQUE_STATUS.PENDING_APPROVAL');
      case AnnouncementCashierChequeStatus.CONSIDERATION:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.CASHIER_CHEQUE_STATUS.CONSIDERATION');
      case AnnouncementExpenseStatus.UPLOAD_RECEIPT:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.EXPENSE_STATUS.UPLOAD_RECEIPT');
      case AnnouncementExpenseStatus.RECEIPT_CORRECT_PENDING:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.EXPENSE_STATUS.RECEIPT_CORRECT_PENDING');
      case AnnouncementExpenseStatus.RECEIPT_PENDING_APPROVAL:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.EXPENSE_STATUS.RECEIPT_PENDING_APPROVAL');
      case AnnouncementExpenseStatus.RECEIPT_COMPLETE:
        return this.translate.instant('AUCTION_LED_CARD.ANNOUNCEMENT.EXPENSE_STATUS.RECEIPT_COMPLETE');
      default:
        return '-';
    }
  }
}
