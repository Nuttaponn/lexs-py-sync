import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TaskService } from '@app/modules/task/services/task.service';
import { AuctionStatus } from '@app/shared/constant';
import { Mode, TMode, auctionActionCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import {
  AuctionBiddingsAnnouncesResponse,
  LatestResolutionInfoResponse,
  LitigationCaseShortDto,
} from '@lexs/lexs-client';
import {
  AucCollateralColType,
  AuctionMenu,
  CollateralTableGroupConfig,
  TableAuctionModel,
  columnNameType,
} from '../auction.model';
import { AuctionService } from '../auction.service';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss'],
})
export class AuctionDetailComponent implements OnInit {
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public collaterals!: any;
  public litigationCaseId!: string;
  public taskCode!: taskCode;
  public dataLawyerForm!: UntypedFormGroup;
  public dataGeneralForm!: UntypedFormGroup;
  public auctionResultForm!: UntypedFormGroup;
  public dataDebtSettlementForm!: UntypedFormGroup;
  public dataDebtSettlement!: any;
  public dataPropertyForm!: any;
  public mode!: TMode;
  public isViewMode!: boolean;
  public genaralDetail!: AuctionBiddingsAnnouncesResponse | undefined;
  // mock feature
  public isAnnouncement!: boolean;
  public messageBanner = '';
  public actionMenu!: AuctionMenu;
  public displayDocumentProp: boolean = false;
  public displayFollowAccountDoc: boolean = false;
  public isForceAccDocFollowupEditMode: boolean = false; // for LEX-18039 only
  public aucRef!: any;
  public actionCode!: auctionActionCode;
  public AuctionMenuI = AuctionMenu;
  public TaskCode = taskCode;
  public updatedDebt: number = 0;

  private statusCode: any;

  /**
   * ทนายความผู้รับผิดชอบ
   */
  get displayResponsibleLawyer() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [
        taskCode.R2E09_00_1A,
        taskCode.R2E09_00_01_1A,
        taskCode.R2E09_06_7C,
        taskCode.R2E09_06_12C,
        taskCode.R2E05_561_A_MOCK,
        taskCode.R2E09_06_03,
      ].includes(this.taskCode) || menu.includes(this.actionMenu)
    );
  }

  /**
   * รายละเอียดทั่วไป
   */
  get displayGeneralDetail() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [taskCode.R2E09_06_7C, taskCode.R2E09_06_12C, taskCode.R2E09_06_03].includes(this.taskCode) ||
      menu.includes(this.actionMenu)
    );
  }

  /**
   * รายละเอียดทรัพย์
   */
  get displayCollateralDetail() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [taskCode.R2E09_06_7C, taskCode.R2E09_06_12C, taskCode.R2E09_05_01_12A, taskCode.R2E09_06_03].includes(
        this.taskCode
      ) || menu.includes(this.actionMenu)
    );
  }

  get displayPropertyDetail() {
    return [taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  /**
   * มติที่ประชุมคณะกรรมการซื้อขายทรัพย์สินพร้อมขาย
   */
  get displaySaleResolution() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [taskCode.R2E09_06_7C, taskCode.R2E09_06_12C, taskCode.R2E09_06_03].includes(this.taskCode) ||
      menu.includes(this.actionMenu) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        [AuctionStatus.NPA_RECEIVE, AuctionStatus.AUCTION, AuctionStatus.COMPLETE].includes(
          this.auctionService.aucStatus as AuctionStatus
        ))
    );
  }

  get displayResultDetail() {
    return [taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  /**
   * รายละเอียดแคชเชียร์เช็คสั่งจ่ายวางหลักประกัน
   */
  get displayAuctionCollateralCheuque() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [taskCode.R2E09_06_7C, taskCode.R2E09_06_12C, taskCode.R2E09_06_03].includes(this.taskCode) ||
      menu.includes(this.actionMenu) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        [AuctionStatus.NPA_RECEIVE, AuctionStatus.AUCTION, AuctionStatus.COMPLETE].includes(
          this.auctionService.aucStatus as AuctionStatus
        ))
    );
  }

  /**
   * รายละเอียดแคชเชียร์เช็คอากร
   */
  get displayAuctionDutyStamp() {
    let menu = [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.ACCOUNT_DOCUMENT];
    return (
      [taskCode.R2E09_06_12C, taskCode.R2E09_06_03].includes(this.taskCode) ||
      menu.includes(this.actionMenu) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        [AuctionStatus.COMPLETE].includes(this.auctionService.aucStatus as AuctionStatus))
    );
  }

  get displaySaleResult() {
    return [taskCode.R2E09_04_01_11, taskCode.R2E09_05_01_12A].includes(this.taskCode);
  }

  get displayDocument() {
    return [taskCode.R2E09_04_01_11].includes(this.taskCode);
  }

  get displayPaymentResult() {
    return [taskCode.R2E09_05_01_12A].includes(this.taskCode);
  }

  /**
   * รายละเอียดแคชเชียร์เช็ควางเงินเพิ่มตามหมายศาล
   */
  get displayOnRequest() {
    return (
      [taskCode.R2E09_06_03].includes(this.taskCode) ||
      [AuctionMenu.CASHIER, AuctionMenu.VIEW_CASHIER, AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT].includes(
        this.actionMenu
      )
    );
  }

  get displayRevoke() {
    return [taskCode.R2E11_LEXS2_552].includes(this.taskCode) || this.actionMenu === 'REVOKE';
  }

  get hasEditModeCheuque() {
    let menu = [AuctionMenu.CASHIER];
    return (
      ((this.taskCode === taskCode.R2E09_06_7C || taskCode.R2E09_06_12C) &&
        ['PENDING', 'CORRECT_PENDING'].includes(this.statusCode) &&
        this.auctionService.hasSubmitPermission) ||
      ([taskCode.R2E05_561_A_MOCK, taskCode.R2E09_06_03].includes(this.taskCode) &&
        ['PENDING', 'CORRECT_PENDING'].includes(this.statusCode)) ||
      menu.includes(this.actionMenu)
    );
  }

  get modeResponsibleLawyer() {
    if (
      [taskCode.R2E09_00_1A, taskCode.R2E05_561_A_MOCK, taskCode.R2E09_00_01_1A].includes(this.taskCode) &&
      this.auctionService.hasSubmitPermission
    ) {
      return 'EDIT';
    } else {
      return 'VIEW';
    }
  }

  // default expand controll
  get isExpandCollateralDetail() {
    return (
      [taskCode.R2E09_05_01_12A].includes(this.taskCode) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        ![AuctionStatus.NPA_RECEIVE].includes(this.genaralDetail?.aucStatus as AuctionStatus))
    );
  }

  get isExpandResponsibleLawyer() {
    return [taskCode.R2E09_00_1A, taskCode.R2E09_00_01_1A].includes(this.taskCode);
  }

  get isExpandGeneralDetail() {
    return (
      [''].includes(this.taskCode) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        ![AuctionStatus.NPA_RECEIVE].includes(this.genaralDetail?.aucStatus as AuctionStatus))
    );
  }

  get isExpandSaleResolution() {
    return (
      [''].includes(this.taskCode) ||
      ([AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) &&
        [AuctionStatus.NPA_RECEIVE, AuctionStatus.AUCTION, AuctionStatus.COMPLETE].includes(
          this.genaralDetail?.aucStatus as AuctionStatus
        ))
    );
  }

  get displayDebtSettlementAccDetail() {
    return (
      [taskCode.R2E09_10_01, taskCode.R2E09_10_02, taskCode.R2E09_10_03].includes(this.taskCode) ||
      [AuctionMenu.VIEW_ACCOUNT].includes(this.actionMenu)
    );
  }

  get displayDebtSettlementAcc() {
    return (
      [taskCode.R2E09_10_01, taskCode.R2E09_10_02, taskCode.R2E09_10_03].includes(this.taskCode) ||
      [AuctionMenu.VIEW_ACCOUNT].includes(this.actionMenu)
    );
  }
  updateDebtSettlement(e: any) {
    this.updatedDebt++;
  }

  auctionResultCollateral: LatestResolutionInfoResponse | undefined;
  public tableConfig: CollateralTableGroupConfig = {
    hasExpand: true,
    hasAction: true,
  };

  public auctionCode = auctionActionCode.R2E09_3;

  public tableColumns: TableAuctionModel[] = [
    {
      colName: columnNameType.orderNumber,
      hideCol: false,
    },
    {
      colName: columnNameType.fsubbidnum,
      hideCol: false,
      isHyperlink: true,
      hyperlinkKey: 'view_group',
    },
    {
      colName: columnNameType.col2,
      hideCol: false,
    },
    {
      colName: columnNameType.col3,
      hideCol: false,
    },
    {
      colName: columnNameType.col4,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col5,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col6,
      hideCol: false,
      isNumber: true,
    },
    {
      colName: columnNameType.col7,
      hideCol: false,
      isDate: true,
    },
    {
      colName: columnNameType.col8,
      hideCol: false,
      isHyperlink: true,
      hyperlinkKey: 'view_doc',
    },
    {
      colName: columnNameType.action,
      hideCol: false,
    },
  ];

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

  constructor(
    private litigationCaseService: LitigationCaseService,
    private taskService: TaskService,
    private auctionService: AuctionService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.isAnnouncement = false;
    this.mode = this.auctionService.mode as TMode;
    this.isViewMode = this.mode === 'VIEW' || this.actionMenu === AuctionMenu.UPLOAD_DOC;
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    if (this.taskCode === taskCode.R2E09_10_02) {
      this.mode = Mode.VIEW;
    }
    this.litigationCaseId = this.taskService.taskDetail?.litigationCaseId || '';
    this.litigationCaseShortDetail = {
      ...this.litigationCaseService.litigationCaseShortDetail,
      legalExecutionLawyerId:
        this.auctionService.currentLed?.publicAuctionLawyerId ||
        this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId,
      legalExecutionLawyerFullName:
        this.auctionService.currentLed?.lawyerName ||
        this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerFullName,
    };
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
    this.auctionResultCollateral = this.auctionService.auctionResultCollateral;
    this.collaterals = this.auctionService.auctionResolutionsLatest?.aucRef
      ? this.auctionService.auctionResolutionsLatest
      : null;
    this.genaralDetail = this.auctionService.auctionBiddingsAnnouncesResponse;
    //
    this.dataGeneralForm = this.auctionService.getGenaralForm(this.genaralDetail);
    this.dataPropertyForm = this.auctionService.auctionBiddingCollateralsSummaryResponse;
    this.dataLawyerForm = this.auctionService.lawyerForm;
    this.dataDebtSettlementForm = this.auctionService.debtForm;
    const auctionBiddingDeedGroup = this.auctionService.auctionBiddingDeedGroupResponse;
    const info = this.auctionService.auctionBidingChequeInfoItem;
    this.auctionService.auctionSubmitResultPerCollateralForm =
      this.auctionService.getAuctionSubmitResultPerCollateralForm(auctionBiddingDeedGroup, info);
    this.auctionResultForm = this.auctionService.auctionSubmitResultPerCollateralForm;
    this.dataDebtSettlement = this.auctionService.debtSettlement;
    this.initData();
    console.log('aucStatus', this.auctionService.aucStatus);
    console.log('displaySaleResolution', this.displaySaleResolution);
    console.log(' this.dataPropertyForm', this.dataPropertyForm);

    if ([taskCode.R2E09_04_01_11].includes(this.taskCode)) {
      this.actionCode = auctionActionCode.R2E09_04_01_11;
    }

    console.log('actionCode', this.actionCode);
    console.log('litigationCaseShortDetail', this.litigationCaseShortDetail);
    console.log('this.dataLawyerFor', this.dataLawyerForm);
    console.log('dataGeneralForm', this.dataGeneralForm);
    console.log('this.dataDebtSettlementForm', this.dataDebtSettlementForm);

    this.tableConfig = {
      hasExpand: true,
      hasAction: true,
    };
    this.initDataForGeneralDetailCard();
    this.initDataForCollateralDetailCard();
    this.initDataForAuctionResolutionCard();
  }

  private async initDataForAuctionResolutionCard() {
    if (
      (this.actionMenu === AuctionMenu.VIEW_CASHIER &&
        [AuctionStatus.NPA_RECEIVE, AuctionStatus.AUCTION, AuctionStatus.COMPLETE].includes(
          this.auctionService.aucStatus as AuctionStatus
        )) ||
      this.displaySaleResolution
    ) {
      const aucRef =
        Number(this.genaralDetail?.aucRef) ||
        Number(this.auctionService.accountDocumentsResponse?.publicAuctionAnnounce?.aucRef);
      const resolution = await this.auctionService.getAuctionResolutionsLatest(aucRef);
      this.auctionService.auctionResolutionsLatest = resolution;
      this.collaterals = resolution.aucRef ? resolution : null;
      this.aucRef = aucRef;
      console.log('this.collaterals xx', this.collaterals);
    } else {
      this.collaterals = this.auctionService.auctionResolutionsLatest?.aucRef
        ? this.auctionService.auctionResolutionsLatest
        : null;
    }
  }

  private initDataForGeneralDetailCard() {
    if (this.actionMenu === AuctionMenu.VIEW_CASHIER) {
      this.genaralDetail = this.auctionService.auctionBiddingsAnnouncesResponse;
      this.dataGeneralForm = this.auctionService.getGenaralForm(this.genaralDetail);
    } else {
      this.genaralDetail = this.auctionService.auctionBiddingsAnnouncesResponse;
      this.dataGeneralForm = this.auctionService.getGenaralForm(this.genaralDetail);
    }
  }

  private initDataForCollateralDetailCard() {
    if (this.displayPropertyDetail) {
      console.log('displayPropertyDetail', this.displayPropertyDetail);
      this.dataPropertyForm = this.auctionService.inquiryDeedGroupResponse;
    } else {
      if (this.actionMenu === AuctionMenu.VIEW_CASHIER) {
        this.dataPropertyForm = this.auctionService.auctionBiddingCollateralsSummaryResponse;
      } else {
        this.dataPropertyForm = this.auctionService.auctionBiddingCollateralsSummaryResponse;
      }
    }
  }

  initData() {
    this.actionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    if (this.displayOnRequest || [taskCode.R2E09_09_03_14_1, taskCode.R2E09_08_01_3_1].includes(this.taskCode))
      this.isViewMode = true;

    this.displayDocumentProp =
      [AuctionMenu.UPLOAD_DOC, AuctionMenu.ACCOUNT_DOCUMENT, AuctionMenu.VIEW_CASHIER].includes(this.actionMenu) ||
      [taskCode.R2E09_08_01_3_1].includes(this.taskCode);
    this.displayFollowAccountDoc =
      [AuctionMenu.VIEW_CASHIER, AuctionMenu.ACCOUNT_DOCUMENT].includes(this.actionMenu) ||
      [taskCode.R2E09_09_01_13_1, taskCode.R2E09_09_03_14_1, taskCode.R2E09_08_01_3_1].includes(this.taskCode);

    // can edit for OnRequest or has permission
    this.isForceAccDocFollowupEditMode =
      this.auctionService.isAccDocFollowupOnRequest ||
      ([taskCode.R2E09_09_01_13_1].includes(this.taskCode) && this.auctionService.hasSubmitPermission);
  }

  getReponsibleLawyerInfo() {
    this.logger.info('getReponsibleLawyerInfo');
  }
}
