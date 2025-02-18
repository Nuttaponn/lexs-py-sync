import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { AdditionalExpenseAuctionDto, AdditionalExpenseSubmit } from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { AuctionLedCardService } from '../auction-led-card.service';
import { AuctionExpenseEfilingDialogComponent } from './auction-expense-efiling-dialog/auction-expense-efiling-dialog.component';
import { AuctionStatus } from '@app/shared/constant/auction-matching-status.constant';
import { AuctionService } from '@app/modules/auction/auction.service';

@Component({
  selector: 'app-auction-led-card-expense',
  templateUrl: './auction-led-card-expense.component.html',
  styleUrls: ['./auction-led-card-expense.component.scss'],
})
export class AuctionLEDCardExpenseComponent implements OnInit {
  @Input() ledInfo!: any;
  @Input() litigationId!: any;

  /** displayColumns */
  public displayedColumns: string[] = [
    'no',
    'date',
    'expenseRequestType',
    'detail',
    'expenseAmount',
    'reason',
    'status',
  ];

  public additionalExpenseInfo: AdditionalExpenseAuctionDto = {};
  public additionalExpenseSubmit = new MatTableDataSource<AdditionalExpenseSubmit>([]);
  public statusSuccess: Array<string> = [AuctionStatus.COMPLETE];
  public statusNormal: Array<string> = ['R2E09_14_3C_PENDING_APPROVAL', 'R2E09-14-3C_PENDING_APPROVAL'];

  public pageSize = 10;
  public pageIndex: number = 1;

  public hasPermission: boolean = false;

  constructor(
    private routerService: RouterService,
    private notificationService: NotificationService,
    private auctionLedCardService: AuctionLedCardService,
    private sessionService: SessionService,
    private auctionService: AuctionService
  ) {
    this.initPermission();
  }

  ngOnInit(): void {
    this.getInquiryAuctionExpense();
  }

  async getInquiryAuctionExpense() {
    const resp = await this.auctionLedCardService.getInquiryAuctionExpense(
      this.ledInfo.ledId,
      this.ledInfo.litigationCaseId
    );
    this.additionalExpenseInfo = resp;
    this.additionalExpenseSubmit.data = resp.additionalExpenseSubmit || [];
    this.additionalExpenseSubmit.filteredData = this.additionalExpenseSubmit.data.slice(0, 10);
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.additionalExpenseSubmit.filteredData = this.additionalExpenseSubmit.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  navigateToAuctionExpenseEFiling() {
    this.notificationService
      .showCustomDialog({
        component: AuctionExpenseEfilingDialogComponent,
        title: 'รายละเอียดวางค่าใช้จ่ายเพิ่มเติม',
        rightButtonLabel: 'ยืนยัน',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        buttonIconName: 'icon-Check-Square',
        hideIcon: true,
        cancelEvent: true,
      })
      .then(response => {
        console.log(response);
        if (!response.isCancel) {
          this.auctionService.currentLed = this.ledInfo;
          this.routerService.navigateTo('/main/lawsuit/auction', {
            mode: 'ADD',
            auctionPaymentType: response.type,
            litigationId: this.litigationId,
            litigationCaseId: this.ledInfo.litigationCaseId,
            ledId: this.ledInfo.ledId,
            auctionCaseTypeCode: this.auctionService.auctionCaseTypeCode,
          });
        }
      });
  }

  navigateToAuctionExpense(auctionExpenseId: number) {
    this.routerService.navigateTo(`/main/lawsuit/auction`, {
      mode: 'VIEW',
      litigationId: this.litigationId,
      litigationCaseId: this.ledInfo.litigationCaseId,
      ledId: this.ledInfo.ledId,
      auctionExpenseId: auctionExpenseId,
      requestMenu: 'VIEW_PAYMENT',
      auctionCaseTypeCode: this.auctionService.auctionCaseTypeCode
    });
  }

  // SUBMIT_AUCTION_EXPENSE;
  initPermission(): void {
    this.hasPermission = this.sessionService.hasPermission(PCode.SUBMIT_AUCTION_EXPENSE);
  }
}
