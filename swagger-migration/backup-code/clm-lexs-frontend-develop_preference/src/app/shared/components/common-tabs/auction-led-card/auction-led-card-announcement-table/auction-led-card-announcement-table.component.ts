import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuctionMenu } from '@app/modules/auction/auction.model';
import { AuctionService } from '@app/modules/auction/auction.service';
import { PageEvent } from '@app/shared/components/paginator/paginator.component';
import { MAIN_ROUTES } from '@app/shared/constant/routes.constant';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { AccountDocumentValidationResponse, AuctionAdditionalPaymentRequest, LedInfoDto } from '@lexs/lexs-client';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import { AuctionLedCardService } from '../auction-led-card.service';
import {
  AnnouncementCashierChequeStatus,
  AnnouncementExpenseStatus,
  AuctionStatus,
} from '@app/shared/constant/auction-matching-status.constant';
import { NotificationService } from '@app/shared/services/notification.service';

@Component({
  selector: 'app-auction-led-card-announcement-table',
  templateUrl: './auction-led-card-announcement-table.component.html',
  styleUrls: ['./auction-led-card-announcement-table.component.scss'],
})
export class AuctionLedCardAnnouncementTableComponent implements OnInit {
  /** displayColumns */
  displayedColumns: string[] = ['no', 'aucLedSeq', 'aucLot', 'aucSet', 'fbidnum', 'aucStatus', 'command'];

  @Input() announcementInfo = new MatTableDataSource<any>([]);
  @Input() ledInfo: LedInfoDto | undefined;

  @Input() isOnTabSuccess = true;
  public pageSize = 10;
  public pageIndex: number = 1;
  public actionOnScreen = {
    acquredAssetDoc: false,
    submitAdditionalDeposit: false,
    submitAccountAudit: false,
  };

  public statusSuccess: Array<string> = [AuctionStatus.COMPLETE, AnnouncementExpenseStatus.RECEIPT_COMPLETE];
  public statusFailed: Array<string> = [AuctionStatus.NPA_ADJUST, AuctionStatus.ADJUST_SUBMIT];
  public statusNormal: Array<string> = [AnnouncementCashierChequeStatus.CONSIDERATION];

  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService,
    private auctionLedCardService: AuctionLedCardService,
    private sessionService: SessionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initAction();
  }

  initAction() {
    this.actionOnScreen.acquredAssetDoc = this.sessionService.hasPermission(PCode.ACQUIRED_ASSET_DOCUMENT_UPLOAD);
    this.actionOnScreen.submitAdditionalDeposit = this.sessionService.hasPermission(
      PCode.SUBMIT_ADDITION_DEPOSIT_CHECK
    );
    this.actionOnScreen.submitAccountAudit =
      this.sessionService.hasPermission(PCode.SUBMIT_ACCOUNT_AUDIT_CERTIFICATION) && this.isOnTabSuccess;
    if (
      !this.actionOnScreen.acquredAssetDoc &&
      !this.actionOnScreen.submitAccountAudit &&
      !this.actionOnScreen.submitAdditionalDeposit
    ) {
      this.displayedColumns.pop();
    }
  }

  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.announcementInfo.filteredData = this.announcementInfo.data.slice(
      event.startLabel ? event.startLabel - 1 : 0,
      event.fromLabel
    );
  }

  navigateToAuctionDetails(e: any) {
    const params = {
      litigationCaseId: e.litigationCaseId,
      litigationId: e.litigationId,
      aucLedSeq: e.aucLedSeq,
      aucRef: e.aucRef,
      mode: 'VIEW',
      auctionMenu: AuctionMenu.VIEW_CASHIER,
    };
    this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`, params);
    this.auctionService.mode = 'VIEW';
    this.auctionService.auctionMenu = AuctionMenu.VIEW_CASHIER;
    this.auctionService.aucStatus = e.aucStatus;
    this.auctionService.aucRef = e.aucRef;
    this.auctionService.currentLed = this.ledInfo;
  }

  async onClickCash(e: any) {
    let req: AuctionAdditionalPaymentRequest = {
      aucRef: e.aucRef,
    };
    let res = await this.auctionService.validateAdditionalPayment(req);
    if (res.isSuccess) {
      this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`, {
        litigationCaseId: e.litigationCaseId,
        auctionMenu: AuctionMenu.CASHIER,
        aucRef: e.aucRef,
        ledId: e.ledId,
      });
      this.auctionService.auctionMenu = AuctionMenu.CASHIER;
      this.auctionService.currentLed = this.ledInfo;
      this.auctionService.aucRef = e.aucRef;
      this.auctionService.ledId = e.ledId;
      this.auctionService.litigationCaseId = e.litigationCaseId;
    }
  }

  async onClickUploadDoc(e: any) {
    let aucRef = e.aucRef;
    let res = await this.auctionLedCardService.validateDocumentConveyanceUploads(aucRef);
    if (res.validated) {
      this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`, {
        litigationCaseId: e.litigationCaseId,
        auctionMenu: AuctionMenu.UPLOAD_DOC,
        aucRef: e.aucRef,
      });
      this.auctionService.auctionMenu = AuctionMenu.UPLOAD_DOC;
      this.auctionService.aucRef = e.aucRef;
      this.auctionService.aucStatus = e.aucStatus;
      this.auctionService.litigationCaseId = e.litigationCaseId;
    }
  }
  async onClickVerifyAccount(e: any) {
    /* validate "[LEXS - 18039] KLAW On request เอกสารบัญชีรับจ่าย" */
    let aucRef = e.aucRef;
    let res: AccountDocumentValidationResponse =
      await this.auctionLedCardService.validateAccountDocumentFollowupProcess(aucRef);
    if (res.validated) {
      this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-detail`, {
        litigationCaseId: e.litigationCaseId,
        auctionMenu: AuctionMenu.ACCOUNT_DOCUMENT,
        aucRef: e.aucRef,
        isOnRequest: 'true',
      });
      this.auctionService.auctionMenu = AuctionMenu.ACCOUNT_DOCUMENT;
      this.auctionService.aucRef = e.aucRef;
    } else if (res && !res.validated /*&& res.reasonCode === 'PENDING_TASK'*/) {
      this.notificationService.alertDialog(
        'EXCEPTION_CONFIG.TITLE_' + (res.reasonCode || '_PENDING_TASK'),
        'EXCEPTION_CONFIG.MESSAGE_' + (res.reasonCode || '_PENDING_TASK')
      );
    }
  }
}
