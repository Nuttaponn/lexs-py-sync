import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuctionLitigationConveyanceProcessDto, LedInfoDto } from '@lexs/lexs-client';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { ConveyanceStatus, MAIN_ROUTES } from '@app/shared/constant';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionLedCardService } from '../auction-led-card.service';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AuctionMenu } from '@app/modules/auction/auction.model';
import { AuctionService } from '@app/modules/auction/auction.service';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { SessionService } from '@app/shared/services/session.service';

@Component({
  selector: 'app-auction-led-card-ownership-transfer',
  templateUrl: './auction-led-card-ownership-transfer.component.html',
  styleUrls: ['./auction-led-card-ownership-transfer.component.scss'],
})
export class AuctionLedCardOwnershipTransferComponent implements OnInit {
  @Input() ledInfo!: LedInfoDto;
  public tabIndex: number = 0;
  public announcementInfo = new MatTableDataSource<AuctionLitigationConveyanceProcessDto>([]);
  public totalProcessAnnounces: number = 0;
  public pageSize = 10;
  public pageIndex: number = 1;
  public actionOnScreen = { canOnRequest: true };
  public displayedColumns: string[] = ['no', 'aucSet', 'date', 'owner', 'office', 'aucStatus', 'command'];

  get ledId() {
    return coerceNumberProperty(this.ledInfo.ledId);
  }

  get litigationCaseId() {
    return coerceNumberProperty(this.ledInfo.litigationCaseId);
  }

  constructor(
    private routerService: RouterService,
    private service: AuctionLedCardService,
    private auctionService: AuctionService,
    private sessionService: SessionService
  ) {}

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndex = event.index;
    switch (event.index) {
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
   * Navigate to งานบันทึกข้อมูลนัดหมายเพื่อโอนกรรมสิทธิ์
   * @param e
   */
  navigateToAuctionDetails(e: AuctionLitigationConveyanceProcessDto, isView: boolean = false) {
    this.auctionService.auctionMenu = isView ? AuctionMenu.OWNERSHIP_TRNASFER : AuctionMenu.VIEW_OWNERSHIP_TRNASFER;
    const params = {
      litigationCaseId: e.litigationCaseId,
      litigationId: e.litigationId,
      aucLedSeq: e.aucLedSeq,
      aucRef: e.aucRef,
      mode: 'VIEW',
      deedGroupId: e.deedGroupId,
      auctionMenu: this.auctionService.auctionMenu,
    };

    this.auctionService.conveyanceStatus = e.conveyanceStatus as ConveyanceStatus;
    this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/owner-transfer`, params);
  }

  loadProcessList() {
    return this.service
      .auctionLedCardOwnershipProcessList(this.litigationCaseId, this.ledId)
      .then(resp => resp)
      .then(resp => (this.announcementInfo.data = resp))
      .then(() => (this.announcementInfo.filteredData = this.announcementInfo.data.slice(0, 10)))
      .then(() => (this.totalProcessAnnounces = this.announcementInfo.data.length))
      .then(() => this.showCommandColumn(this.sessionService.hasPermission(PCode.ASSET_TRANSFER_APPOINTMENT)))
      .catch(() => this.clear());
  }

  loadCompletedList() {
    return (
      this.service
        .auctionLedCardOwnershipCompletedList(this.litigationCaseId, this.ledId)
        .then(resp => (this.announcementInfo.data = resp))
        .then(() => (this.announcementInfo.filteredData = this.announcementInfo.data.slice(0, 10)))
        // .then(() => (this.totalProcessAnnounces = this.announcementInfo.data.length))
        .then(() => this.showCommandColumn(false))
        .catch(() => this.clear())
    );
  }

  clear() {
    this.announcementInfo.data = [];
    this.announcementInfo.filteredData = [];
  }

  showCommandColumn(show: boolean = true) {
    const hasCommand = this.displayedColumns.includes('command');
    if (hasCommand && show) return;
    if (hasCommand && !show) return this.displayedColumns.pop();
    if (!hasCommand && show) return this.displayedColumns.push('command');
    if (!hasCommand && !show) return;
    return;
  }
}
