import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { AuctionStatus } from '@app/shared/constant';
import { ActionBar, auctionActionCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { AuctionLexsSeizureDto, AuctionMatchRequest, InquiryAnnouncesResponse } from '@lexs/lexs-client';
import { AucLexsSeizureColType } from '../auction.model';
import { AuctionService } from '../auction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auc-announement-match',
  templateUrl: './auc-announement-match.component.html',
  styleUrls: ['./auc-announement-match.component.scss'],
})
export class AucAnnounementMatchComponent implements OnInit {
  public actionBar: ActionBar = {
    hasSave: false,
    hasPrimary: true,
    primaryText: 'MATCHING_PROPERTY.BTN_MATCHING_SELECTED',
    primaryIcon: 'icon-Match',
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  public AUCTION_STATUS = AuctionStatus;
  public data: Array<AuctionLexsSeizureDto> = [];
  public anouncementDetail: InquiryAnnouncesResponse | undefined;
  public defaultColumnConfig = [
    AucLexsSeizureColType.selection,
    AucLexsSeizureColType.orderNumber,
    AucLexsSeizureColType.redCaseNo,
    AucLexsSeizureColType.ledName,
    AucLexsSeizureColType.civilCourtName,
    AucLexsSeizureColType.seizureTimestamp,
    AucLexsSeizureColType.seizureLedType,
  ];
  public selection = new SelectionModel<number>(true, []);
  public auctionStatusCode: AuctionStatus = '' as AuctionStatus;
  constructor(
    private logger: LoggerService,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private routerService: RouterService,
    private litigationCaseService: LitigationCaseService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.data = this.auctionService.auctionLexsSeizures?.auctionLexsSeizures || [];
    this.anouncementDetail = this.auctionService.selectAnouncementDetail;
    this.auctionStatusCode =
      (this.auctionService.selectAnouncementDetail?.aucStatus as AuctionStatus) || ('' as AuctionStatus);
  }

  async onBack() {
    if (this.selection.selected.length > 0) {
      await this.auctionService.openConfirmBackToEdit();
    } else {
      this.routerService.back();
    }
  }
  async onSubmit() {
    if (this.selection.selected.length === 0) {
      const res = await this.notificationService.alertDialog(
        'MATCHING_PROPERTY.WARNING_MSG.TITLE_CANT_MATCH_AUC_ANNOUNCE',
        'MATCHING_PROPERTY.WARNING_MSG.DETAIL_CANT_MATCH_AUC_ANNOUNCE'
      );
      this.logger.info('onSubmit alertDialog res :: ', res);
      return;
    }

    const selectLexsSeizure = this.data.filter(it => {
      const matched = this.selection.selected.includes(it.seizureLedId || 0);
      return matched;
    });
    if (
      !selectLexsSeizure.every(
        it => it.redCaseNo === selectLexsSeizure[0].redCaseNo && it.ledId === selectLexsSeizure[0].ledId
      )
    ) {
      await this.notificationService.alertDialog(
        'MATCHING_PROPERTY.WARNING_MSG.TITLE_CANT_MATCH_ANNOUNCE',
        'MATCHING_PROPERTY.WARNING_MSG.DETAIL_CANT_MATCH_ANNOUNCE'
      );
      return;
    }

    const res = await this.notificationService.confirm(
      'MATCHING_PROPERTY.WARNING_MSG.TITLE_CONFIRM',
      'MATCHING_PROPERTY.WARNING_MSG.DETAIL_CONFIRM',
      {
        rightButtonLabel: 'AUC_ANNOUNEMENT_MAP_COLLATERAL.CONFIRM_MAP',
        buttonIconName: 'icon-Selected',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        leftButtonClass: 'long-button',
      }
    );
    if (res) {
      try {
        const aucRef = Number(this.anouncementDetail?.aucRef);
        const request: AuctionMatchRequest = {
          redCaseNo: selectLexsSeizure[0].redCaseNo || '',
          ledId: selectLexsSeizure[0].ledId || 0,
          courtNo: selectLexsSeizure[0].civilCourtNo || '',
        };
        await this.auctionService.postAuctionMatch(aucRef, request);
        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('MATCHING_PROPERTY.MATCHING_SUCCESS')
        );
        await this.updateDataDetailAndBack();
      } catch (error: any) {
        this.logger.info('AucAnnounementMatchComponent => onSubmit', error);
        await this.auctionService.handleErrorForAuction(error);
      }
    }
  }

  updateSelectedItem($event: any) {
    this.logger.info('AucAnnounementMatchComponent => updateSelectItem', $event);
    this.selection = $event;
  }

  async updateDataDetailAndBack() {
    const response = await this.auctionService.getAuctionAnnounces([AuctionStatus.MATCHING]);

    if (response.length > 0) {
      const matchDetail = response.find(it => it.aucRef === this.anouncementDetail?.aucRef);
      this.litigationCaseService.litigationCaseShortDetail =
        await this.litigationCaseService.getLitigationCaseShortDetail(Number(matchDetail?.litigationCaseId));
      this.auctionService.selectAnouncementDetail = matchDetail;
      this.auctionService.actionCode = auctionActionCode.R2E09_4;
      const responseCollateral = await this.auctionService.getAuctionCollateral(Number(this.anouncementDetail?.aucRef));
      this.auctionService.auctionCollaterals = responseCollateral;
      this.routerService.popStack();
      const destination = this.auctionService.routeCorrection('auction-annoucement-detail');
      this.routerService.navigateTo(destination, {
        litigationId: matchDetail?.litigationId,
        litigationCaseId: matchDetail?.litigationCaseId,
        mode: 'EDIT',
        actionCode: auctionActionCode.R2E09_4,
        actionType: taskCode.ON_REQUEST,
      });
    }
  }
}
