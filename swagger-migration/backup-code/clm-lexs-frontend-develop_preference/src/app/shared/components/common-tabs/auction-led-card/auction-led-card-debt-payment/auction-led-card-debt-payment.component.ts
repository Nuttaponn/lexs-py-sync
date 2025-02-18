import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuctionLigationCaseDebtSettlementAccountResponse, LedInfoDto } from '@lexs/lexs-client';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { MAIN_ROUTES } from '@app/shared/constant';
import { RouterService } from '@app/shared/services/router.service';
import { ITooltip } from '@app/shared/models';
import { AuctionMenu } from '@app/modules/auction/auction.model';
import { AuctionLedCardService } from '../auction-led-card.service';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { coerceString } from '@app/shared/utils';

@Component({
  selector: 'app-auction-led-card-debt-payment',
  templateUrl: './auction-led-card-debt-payment.component.html',
  styleUrls: ['./auction-led-card-debt-payment.component.scss'],
})
export class AuctionLedCardDebtPaymentComponent implements OnInit {
  @Input()
  public ledInfo!: LedInfoDto;

  public tabIndex: number = 0;
  public totalProcessAnnounces: number | undefined = 0;
  public announcementInfo = new MatTableDataSource<AuctionLigationCaseDebtSettlementAccountResponse>([]);
  public pageSize = 10;
  public pageIndex: number = 1;
  public actionOnScreen = { canOnRequest: true };
  public displayedColumns: string[] = [
    'no',
    'sellDate',
    'assets',
    'debtType',
    'debtDate',
    'debtAmount',
    'debtPayment',
    'aucStatus',
  ];

  get ledId() {
    return coerceNumberProperty(this.ledInfo.ledId);
  }

  get litigationCaseId() {
    return coerceNumberProperty(this.ledInfo.litigationCaseId);
  }

  constructor(
    private routerService: RouterService,
    private auctionLedService: AuctionLedCardService
  ) {}

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    switch (this.tabIndex) {
      case 0:
        this.clear();
        this.loadProcessList();
        break;
      case 1:
        this.clear();
        this.loadCompletedList();
    }
  }

  ngOnInit(): void {
    if (this.tabIndex === 0) {
      this.loadProcessList();
    }
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.announcementInfo.filteredData = this.announcementInfo.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  /**
   * Navigate to บันทึกการตัดชำระหนี้
   * @param e
   */
  navigateToAuctionDetails(e: AuctionLigationCaseDebtSettlementAccountResponse) {
    const params = {
      litigationCaseId: this.litigationCaseId,
      auctionDebtSettlementAccountId: e.auctionDebtSettlementAccountId,
      mode: 'VIEW',
      auctionMenu: AuctionMenu.VIEW_ACCOUNT,
    };

    this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`, params);
  }

  loadCompletedList() {
    return this.auctionLedService
      .auctionDebtSettlementAccountCompletedList(this.ledId, this.litigationCaseId)
      .then(resp => (this.announcementInfo.data = resp.map((it, index) => this.mapRawToColumn(it, index))))
      .then(() => (this.announcementInfo.filteredData = this.announcementInfo.data.slice(0, 10)));
  }

  loadProcessList() {
    return this.auctionLedService
      .auctionDebtSettlementAccountProcessList(this.ledId, this.litigationCaseId)
      .then(resp => (this.announcementInfo.data = resp.map((it, index) => this.mapRawToColumn(it, index))))
      .then(() => (this.totalProcessAnnounces = this.announcementInfo.data.length))
      .then(() => (this.announcementInfo.filteredData = this.announcementInfo.data.slice(0, 10)));
  }

  clear() {
    this.announcementInfo.data = [];
    this.announcementInfo.filteredData = [];
  }

  mapRawToColumn(it: AuctionLigationCaseDebtSettlementAccountResponse, index: number) {
    const tooltipTitle = [{ title: 'รายการชุดทรัพย์' }];
    const tooltipItems = (it.collateralGroups || [])
      .sort((a: any, b: any) => {
        const result = a?.fsubbidnum?.toString()?.localeCompare(b?.fsubbidnum?.toString(), 'en', { numeric: true });
        return result;
      })
      .map(s => ({ content: 'ชุดทรัพย์ที่ ' + s.fsubbidnum }));

    const tooltip: Array<ITooltip> = [...tooltipTitle, ...tooltipItems];

    return {
      orderNumber: coerceString(index + 1),
      createTimestamp: it.createTimestamp,
      totalDeedGroup: it.totalDeedGroup,
      documentType: it.documentType,
      totalDebtSettlementAmount: it.totalDebtSettlementAmount,
      auctionDebtSettlementAccountId: it.auctionDebtSettlementAccountId,
      approvedTimestamp: it.approvedTimestamp,
      totalAmount: it.totalAmount,
      status: it.status,
      tooltipParams: tooltip,
      statusName: it.statusName,
    };
  }
}
