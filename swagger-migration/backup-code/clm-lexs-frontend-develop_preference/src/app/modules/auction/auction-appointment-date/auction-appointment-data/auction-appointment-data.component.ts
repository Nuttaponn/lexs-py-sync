import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { auctionActionCode, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { AucCollateralColType, AuctionMenu } from '../../auction.model';
import { AuctionService } from '../../auction.service';
import { AuctionDetailItemPaymentResultService } from '../../auction-detail-item-payment-result/auction-detail-item-payment-result.service';
import { CollateralGroup } from '@lexs/lexs-client';

@Component({
  selector: 'app-auction-appointment-data',
  templateUrl: './auction-appointment-data.component.html',
  styleUrls: ['./auction-appointment-data.component.scss'],
})
export class AuctionAppointmentDataComponent implements OnInit {
  @Input() defaultExpandAuctionResult: boolean = true;
  @Input() isViewModeAuctionPaymentResult: boolean = true;
  public auctionBiddingDeedGroupResponse!: any;
  public deedGroupId!: any;
  public aucBiddingId!: any;
  public dataInfo!: any;
  public isOpened: Boolean = false;
  public actionCode = auctionActionCode.R2E09_16282;
  public fsubbidnum!: any;
  public data!: any;
  public auctionResultForm!: UntypedFormGroup;
  public aucRef!: any;
  public isViewMode: boolean = true;
  public taskCode!: taskCode;
  // item-payment-result
  public collateralGroupForm!: UntypedFormGroup;
  // item-payment-result
  public tableConfig: any = {};
  public trackingRound = 0;

  private defaultColumnConfig = [
    AucCollateralColType.orderNumber,
    AucCollateralColType.fsubbidnum,
    AucCollateralColType.assettypedesc,
    AucCollateralColType.landtype,
    AucCollateralColType.collateralDocNo,
    AucCollateralColType.assetDetail,
    AucCollateralColType.redCaseNo,
    AucCollateralColType.saletypedesc,
    AucCollateralColType.debtname,
    AucCollateralColType.ownername,
    AucCollateralColType.personName1,
    AucCollateralColType.personName2,
    AucCollateralColType.occupant,
    AucCollateralColType.ledname,
    AucCollateralColType.remark,
  ];

  public collateralUnmatchedColumns = [
    ...this.defaultColumnConfig,
    AucCollateralColType.col15,
    AucCollateralColType.col16,
    AucCollateralColType.action,
  ];

  get isPaymentResult() {
    return [taskCode.R2E09_06_03].includes(this.taskCode);
  }

  get isItemPaymentResult() {
    return (
      [taskCode.R2E09_05_01_12A].includes(this.taskCode) ||
      (this.auctionService.auctionMenu === AuctionMenu.VIEW_CASHIER &&
        this.auctionService?.externalPaymentTrackingLatest?.paymentTrackingResult)
    );
  }

  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService,
    private auctionDetailItemPaymentResultService: AuctionDetailItemPaymentResultService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    console.log('AuctionAppointmentDateDetailComponent');
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    console.log('taskCode', this.taskCode);
    // this.actionCode = this.taskCode as auctionActionCode;
    if (this.taskCode === taskCode.R2E09_05_01_12A) {
      this.tableConfig = { hideFbidnum: true, showTotal: true };
    }
    this.auctionBiddingDeedGroupResponse = this.auctionService.auctionBiddingDeedGroupResponse;
    this.dataInfo = this.auctionService.auctionResultCollateral;
    this.data = this.auctionService.auctionInquiryBiddingCollaterals;
    // item-payment-result
    if (
      this.auctionService.auctionMenu === AuctionMenu.VIEW_CASHIER &&
      this.auctionService?.externalPaymentTrackingLatest?.paymentTrackingResult
    ) {
      let collateralGroupData: CollateralGroup = this.auctionService.externalPaymentTrackingLatest;
      this.auctionDetailItemPaymentResultService.collateralGroupForm =
        this.auctionDetailItemPaymentResultService.getCollateralGroupForm(collateralGroupData);
      this.collateralGroupForm = this.auctionDetailItemPaymentResultService.collateralGroupForm;
    } else {
      this.trackingRound = this.auctionService?.externalPaymentTrackingResponse?.trackingRound || 0;
      let collateralGroupData: CollateralGroup = this.auctionDetailItemPaymentResultService.collateralGroup;
      this.auctionDetailItemPaymentResultService.collateralGroupForm =
        this.auctionDetailItemPaymentResultService.getCollateralGroupForm(collateralGroupData);
      this.collateralGroupForm = this.auctionDetailItemPaymentResultService.collateralGroupForm;
    }

    //item-payment-result

    this.fsubbidnum = this.auctionBiddingDeedGroupResponse.fsubbidnum;

    console.log(' this.fsubbidnum', this.fsubbidnum);
    let data = {
      aucResult: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.aucResult,
      auctionResult: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.unsoldReasonType,
      remark: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.remark,
      aucLedSeq: this.auctionBiddingDeedGroupResponse?.aucLedSeq,
      soldDate: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.soldDate,
      aucBiddingDeedGroupStatus: this.auctionBiddingDeedGroupResponse?.aucBiddingDeedGroupStatus,
      bidDate: this.auctionBiddingDeedGroupResponse?.bidDate,
      aucRound: this.auctionBiddingDeedGroupResponse?.aucRound,
      liticationType: this.auctionBiddingDeedGroupResponse?.liticationType,
      buyerType: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.buyerType,
      buyerName: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.buyerName,
      soldPrice: this.auctionBiddingDeedGroupResponse?.aucBiddingResult?.soldPrice,
      aucBiddingDeedGroupDocuments: this.auctionBiddingDeedGroupResponse?.aucBiddingDeedGroupDocuments,
    };
    const chequeInfo = this.auctionService.auctionBidingChequeInfoItem;
    this.auctionService.auctionSubmitResultPerCollateralForm =
      this.auctionService.getAuctionSubmitResultPerCollateralForm(this.auctionBiddingDeedGroupResponse, chequeInfo);
    this.auctionService.auctionResultBidForm = this.auctionService.getAuctionResultBidForm(data);

    console.log('this.auctionService.auctionResultBidForm ', this.auctionService.auctionResultBidForm);
    this.auctionResultForm = this.isItemPaymentResult
      ? this.auctionService.auctionResultBidForm
      : this.auctionService.auctionSubmitResultPerCollateralForm;
  }

  onBack() {
    this.routerService.back();
  }
}
