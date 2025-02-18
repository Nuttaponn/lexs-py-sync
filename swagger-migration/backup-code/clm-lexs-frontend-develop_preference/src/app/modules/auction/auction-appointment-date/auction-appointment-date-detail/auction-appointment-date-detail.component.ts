import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { auctionActionCode, taskCode } from '@app/shared/models';
import { RouterService } from '@app/shared/services/router.service';
import { AucCollateralColType } from '../../auction.model';
import { AuctionService } from '../../auction.service';

@Component({
  selector: 'app-auction-appointment-date-detail',
  templateUrl: './auction-appointment-date-detail.component.html',
  styleUrls: ['./auction-appointment-date-detail.component.scss'],
})
export class AuctionAppointmentDateDetailComponent implements OnInit {
  public messageBanner = '';
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

  constructor(
    private routerService: RouterService,
    private auctionService: AuctionService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    console.log('AuctionAppointmentDateDetailComponent');
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;

    this.auctionBiddingDeedGroupResponse = this.auctionService.auctionBiddingDeedGroupResponse;
    this.dataInfo = this.auctionService.auctionResultCollateral;
    this.data = this.auctionService.auctionInquiryBiddingCollaterals;

    this.fsubbidnum = this.auctionBiddingDeedGroupResponse.fsubbidnum;
    console.log(' this.fsubbidnum', this.fsubbidnum);
    let data = {
      aucResult: this.auctionBiddingDeedGroupResponse.aucBiddingResult.aucResult,
      auctionResult: this.auctionBiddingDeedGroupResponse.aucBiddingResult.unsoldReasonType,
      remark: this.auctionBiddingDeedGroupResponse.aucBiddingResult.remark,
      aucLedSeq: this.auctionBiddingDeedGroupResponse.aucLedSeq,
      soldDate: this.auctionBiddingDeedGroupResponse.aucBiddingResult.soldDate,
      aucBiddingDeedGroupStatus: this.auctionBiddingDeedGroupResponse.aucBiddingDeedGroupStatus,
    };
    this.auctionService.auctionSubmitResultPerCollateralForm =
      this.auctionService.getAuctionSubmitResultPerCollateralForm(this.auctionBiddingDeedGroupResponse);
    this.auctionService.auctionResultBidForm = this.auctionService.getAuctionResultBidForm(data);
    this.auctionResultForm = this.isPaymentResult
      ? this.auctionService.auctionResultBidForm
      : this.auctionService.auctionSubmitResultPerCollateralForm;
  }

  onBack() {
    this.routerService.back();
  }
}
