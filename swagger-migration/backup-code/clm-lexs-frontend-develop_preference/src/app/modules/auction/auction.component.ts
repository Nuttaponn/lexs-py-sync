import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { SubButtonModel } from '@app/shared/components/action-bar/action-bar.component';
import { AuctionLedCardService } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.service';
import {
  AuctionMathchingStatus,
  AuctionStatus,
  DOC_TEMPLATE,
  MAIN_ROUTES,
  CIVIL_CASE_TAB_ROUTES,
} from '@app/shared/constant';
import { ActionBarMeta, IUploadMultiFile, TMode, auctionActionCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import { SessionService } from '@app/shared/services/session.service';
import { LexsUserPermissionCodes as PCode } from '@shared/models/permission';
import {
  AuctionBiddingDocumentRequest,
  AuctionBiddingResultRecordingTasksSubmitRequest,
  AuctionBiddingResultsRequest,
  AuctionCashierAdditionApprovalRequest,
  AuctionCashierApprovalRequest,
  AuctionCashierCollateralRequest,
  AuctionCashierStampDutySubmitRequest,
  AuctionDebtSettlementRequest,
  AuctionExpenseRequest,
  AuctionReasonRequest,
  AuctionResultRecordingSubmitRequest,
  ConveyanceDeedGroupDocument,
  ConveyanceDeedGroupDocuments,
  ConveyanceUploadDocumentBody,
  ConveyanceUploadDocumentRequest,
  ConveyanceUploadDocumentResponse,
  DocumentTemplateAndUploadSessionId,
  ExternalPaymentTrackingDeedGroupRequest,
  LitigationCaseShortDto,
  SubmitAuctionAssignLawyerRequest,
  Document,
  AccountDocumentResultRecordingRequest,
  AccountDocumentFollowUpTaskApprovalRequest,
  AccountDocFollowup,
  AuctionCashierAdditionalPaymentSubmitRequest,
  AuctionCashierExpenseApprovalRequest,
  DocumentDto,
  AuctionExpenseNonEFilingReceiptRequest,
  PostApprovalRequest,
  LexsUserOption,
  AuctionCreateAnnounceSubmitRequest,
} from '@lexs/lexs-client';
import { BuddhistEraPipe, DialogOptions } from '@spig/core';
import moment from 'moment';
import { TaskService } from '../task/services/task.service';
import { LegalExecutionWithdrawConfirmationDialogComponent } from '../withdrawn-seizure-property/legal-execution-office-info/dialog/legal-execution-withdraw-confirmation-dialog/legal-execution-withdraw-confirmation-dialog.component';
import { AuctionPaymentService } from './auction-advance-payment/service/auction-payment.service';
import {
  AuctionDebtSettlementAccountTransactionExtend,
  AuctionResultSubmitStatus,
  SubmitAuctionResultAction,
} from './auction.const';
import { AuctionMenu } from './auction.model';
import { AuctionService } from './auction.service';
import { RejectAuctionCashierChequeDialogComponent } from './reject-auction-cashier-cheque-dialog/reject-auction-cashier-cheque-dialog.component';
import { SubmitCancelMatchingDialogComponent } from './submit-cancel-matching-dialog/submit-cancel-matching-dialog.component';
import { SubmitEditAnnouncementDialogComponent } from './submit-edit-announcement-dialog/submit-edit-announcement-dialog.component';
import { SubmitReleaseAnnouncementDialogComponent } from './submit-release-announcement-dialog/submit-release-announcement-dialog.component';
import { AuctionDetailItemPaymentResultService } from '@modules/auction/auction-detail-item-payment-result/auction-detail-item-payment-result.service';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { AccDocScenario, specifiedDocumentsDict } from './auction-follow-account-doc/auction-follow-account-doc.const';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '@app/shared/utils';
import { SubSink } from 'subsink';
import { UserService } from '../user/user.service';
import { AucAnnounementMatchDialogComponent } from './auc-announement-match-dialog/auc-announement-match-dialog.component';
import { NewAuctionService } from './auction-add/new-auction.service';
import { ExternalDocumentsService } from '../external-documents/external-documents.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss'],
  providers: [BuddhistEraPipe],
})
export class AuctionComponent implements OnInit, OnDestroy {
  ICON_TYPE = {
    TASK_LIST: 'icon-Task-List',
    LIST_MUTILPLE: 'icon-List-Multiple',
    LIST_CHEQUE: 'icon-Cheque',
    VIEW_CASHIER: 'icon-Document-Bullet-List',
    UPLOAD: 'icon-Arrow-Upload',
    VIEW_PAYMENT: 'icon-Money',
    ICON_LIST: 'icon-List',
    AUCTION_SUBMIT: 'icon-Auction-Submit',
    MONEY_HAND: 'icon-Money-Hand',
    DOCUMENT_TEXT: 'icon-Document-Text',
  };
  public AUCTION_STATUS = AuctionStatus;
  public AUCTION_MATHCHING_STATUS = AuctionMathchingStatus;
  public accessPermissions = this.sessionService.accessPermissions();
  public permissions = this.accessPermissions.permissions;
  public additionalPaymentCashierId!: number;

  public actionBar: ActionBarMeta = {
    hasSave: false,
    hasPrimary: false,
    hasCancel: false,
    hasReject: false,
    hasEdit: false,
  };
  subButtonList!: SubButtonModel[];
  maxSubButton!: number;

  title!: string;
  taskIcon!: string;
  statusName: any;
  statusCode: any;
  taskCode!: taskCode;
  public mode!: TMode;

  messageBanner = '';
  errorBannerMsg = '';

  public hasSubmitPermission = false;
  public hasAdditionalTitle = false;
  public additionalTitle = '';
  public auctionCaseTypeCode = '';

  public litigationCaseId = '';

  get isOwnerTask() {
    if (this.mode === 'ADD') return true;
    return this.sessionService.isOwnerTask(
      this.taskService.taskOwner,
      this.taskService.taskDetail.enableTaskSupportRole
    );
  }

  get isEditor() {
    return ['APPROVER', 'MAKER'].includes(this.accessPermissions.subRoleCode);
  }

  get isAuctionSubmitResultLanding() {
    const res = this.routerService.currentRoute.indexOf('/auction-detail') > -1;
    return res;
  }

  get actionCode() {
    return this.auctionService.actionCode ?? '';
  }

  get isDisplayTitleStatus() {
    return [
      taskCode.R2E09_00_1A,
      taskCode.R2E09_00_01_1A,
      taskCode.R2E09_02_3B,
      taskCode.R2E09_06_7C,
      taskCode.R2E09_06_12C,
      taskCode.R2E09_04_01_11,
      taskCode.R2E09_05_01_12A,
      taskCode.R2E09_06_03,
      taskCode.R2E09_08_01_3_1,
      taskCode.R2E05_561_A_MOCK,
      taskCode.R2E11_LEXS2_552,
      taskCode.R2E09_10_01,
      taskCode.R2E09_10_02,
      taskCode.R2E09_10_03,
      taskCode.R2E09_09_01_13_1,
      taskCode.R2E09_09_03_14_1,
      taskCode.R2E09_14_3C,
      taskCode.R2E35_02_E09_01_7A,
      taskCode.R2E35_02_E09_02_7B,
    ].includes(this.taskCode);
  }

  get IsHideHeaerContent() {
    return this.auctionService.hideContentHeader;
  }

  get isAuctionNormalStatusGroup() {
    return (
      [taskCode.R2E09_10_02].includes(this.taskCode) ||
      [AuctionStatus.R2E09_14_3C_PENDING_APPROVAL, AuctionStatus.R2E09_10_02_CREATE].includes(this.auctionStatusCode)
    );
  }

  get isAuctionSuccessStatusGroup() {
    if (this.auctionMenu === AuctionMenu.VIEW_CASHIER) {
      return [AuctionStatus.COMPLETE].includes(this.auctionStatusCode);
    } else {
      return [
        AuctionStatus.NPA_SUBMIT,
        AuctionStatus.PROCEED,
        AuctionStatus.COMPLETE,
        AuctionStatus.R2E09_10_02_COMPLETE,
        AuctionStatus.ADJUST_SUBMIT
      ].includes(this.auctionStatusCode);
    }
  }
  get isAuctionPendingStatusGroup() {
    if (
      this.auctionMenu === AuctionMenu.CASHIER ||
      this.auctionMenu === AuctionMenu.VIEW_CASHIER ||
      this.auctionMenu === AuctionMenu.UPLOAD_DOC ||
      this.auctionMenu === AuctionMenu.VIEW_ACCOUNT ||
      [taskCode.R2E09_06_7C, taskCode.R2E09_10_01, taskCode.R2E09_06_03, taskCode.R2E09_10_03].includes(this.taskCode)
    ) {
      return (
        [
          AuctionStatus.NPA_SUBMIT,
          AuctionStatus.PROCEED,
          AuctionStatus.NPA_RECEIVE,
          AuctionStatus.AUCTION,
          AuctionStatus.PENDING_AUCTION,
          AuctionStatus.APPRAISAL,
          AuctionMenu.VIEW_ACCOUNT,
          AuctionStatus.R2E09_10_01_CREATE,
          AuctionStatus.R2E09_10_03_CREATE,
        ].includes(this.auctionStatusCode) || [AuctionMenu.UPLOAD_DOC].includes(this.auctionMenu)
      );
    } else {
      return [
        AuctionStatus.MATCHING,
        AuctionStatus.R2E09_02_3B_PENDING_SAVE,
        AuctionStatus.R2E09_02_3B_PENDING_PAYMENT,
        AuctionStatus.R2E09_02_3B_PAYMENT_COMPLETE_PENDING_SAVE,
        AuctionStatus.R2E09_14_3C_PENDING_SAVE,
        AuctionStatus.R2E09_14_3C_PENDING_UPDATE,
        AuctionStatus.R2E09_14_3C_PENDING_REVIEW,
        AuctionStatus.R2E35_02_E09_01_7A_PENDING_RECEIPT_UPLOAD,
        AuctionStatus.R2E35_02_E09_02_7B_PENDING_RECEIPT_UPDATE,
        AuctionStatus.R2E35_02_E09_02_7B_PENDING_RECEIPT_VERIFICATION,
      ].includes(this.auctionStatusCode);
    }
  }
  get isAuctionInfoStatusGroup() {
    if (this.auctionMenu === AuctionMenu.VIEW_CASHIER) {
      return [''].includes(this.auctionStatusCode);
    } else {
      return [AuctionStatus.NOT_PROCEED, AuctionStatus.R2E09_10_02_CREATE].includes(this.auctionStatusCode);
    }
  }

  get isAuctionFailedStatusGroup() {
    if (this.auctionMenu === AuctionMenu.VIEW_CASHIER) {
      return [AuctionStatus.NPA_ADJUST, AuctionStatus.ADJUST_SUBMIT].includes(this.auctionStatusCode);
    } else {
      return false;
    }
  }

  get hideLitigationDetail() {
    return (
      ([taskCode.R2E09_04_01_11].includes(this.taskCode) && this.isAuctionSubmitResultLanding) ||
      ([taskCode.R2E09_05_01_12A].includes(this.taskCode) && this.isItemPaymentResult)
    );
  }

  get hideRelatedLitigationDetail() {
    return this.hideLitigationDetail;
  }

  get isItemPaymentResult() {
    const res = this.routerService.currentRoute.indexOf('/auction-item-payment-result') > -1;
    return res;
  }

  get auctionCollateralId() {
    return coerceNumberProperty(this.taskService.taskDetail.objectId);
  }

  get taskId() {
    return coerceNumberProperty(this.taskService.taskDetail.id);
  }

  private titleMapper = new Map<taskCode | string, string>([
    [taskCode.R2E09_00_1A, 'AUCTION.TITLE_R2E09_00_1A'],
    [taskCode.R2E09_00_01_1A, 'AUCTION.TITLE_R2E09_00_01_1A'],
    [taskCode.R2E05_561_A_MOCK, 'AUCTION.TITLE_R2E05_561_A_MOCK'],
    [taskCode.R2E09_02_3B, 'AUCTION.TITLE_R2E09_02_3B'],
    [taskCode.R2E09_06_7C, 'AUCTION.TITLE_R2E09_06_7C_PENDING'],
    [taskCode.R2E09_04_01_11, 'AUCTION.TITLE_R2E09_04_01_11'],
    [taskCode.R2E09_06_12C, 'AUCTION.TITLE_R2E09_06_12C_PENDING'],
    [taskCode.R2E09_05_01_12A, 'AUCTION.TITLE_R2E09_05_01_12A'],
    [taskCode.R2E09_09_01_13_1, 'AUCTION.TITLE_R2E09_09_01_13_1'],
    [taskCode.R2E09_09_03_14_1, 'AUCTION.TITLE_R2E09_09_03_14_1'],
    [auctionActionCode.R2E09_2_A as taskCode, 'AUCTION.TITLE_AUCTION_R2E09_2_A'],
    [auctionActionCode.R2E09_4 as taskCode, 'AUCTION.TITLE_AUCTION_R2E09_4'],
    [AuctionMenu.CASHIER, 'AUCTION.TITLE_MENU_CASHIER'],
    [AuctionMenu.VIEW_CASHIER, 'AUCTION.TITLE_MENU_VIEW_CASHIER'],
    [AuctionMenu.UPLOAD_DOC, 'AUCTION.TITLE_MENU_UPLOAD_DOC'],
    [taskCode.R2E11_LEXS2_552, 'AUCTION.TITLE_R2E11_LEXS2_552'],
    [taskCode.R2E09_10_01, 'AUCTION.TITLE_R2E09_10_01'],
    [taskCode.R2E09_10_02, 'AUCTION.TITLE_R2E09_10_02'],
    [taskCode.R2E09_10_03, 'AUCTION.TITLE_R2E09_10_03'],
    [taskCode.R2E09_06_03, 'AUCTION.TITLE_R2E09_06_03'],
    [taskCode.R2E09_14_3C, 'AUCTION.TITLE_R2E09_14_3C'],
    [taskCode.R2E35_02_E09_01_7A, 'AUCTION.TITLE_R2E35_02_E09_01_7A'],
    [taskCode.R2E35_02_E09_02_7B, 'AUCTION.TITLE_R2E35_02_E09_02_7B'],
    [AuctionMenu.VIEW_ACCOUNT, 'AUCTION.TITLE_MENU_VIEW_ACCOUNT'],
    [AuctionMenu.ACCOUNT_DOCUMENT, 'AUCTION.TITLE_MENU_ACCOUNT_DOCUMENT'],
    [auctionActionCode.PENDING_NEW_ANNOUNCE, 'AUCTION.TITLE_PENDING_NEW_ANNOUNCE'],
    [auctionActionCode.PENDING_NEW_DEEDGROUP, 'AUCTION.TITLE_PENDING_NEW_DEEDGROUP'],
    [auctionActionCode.PENDING_NEW_VALIDATE, 'AUCTION.TITLE_PENDING_NEW_VALIDATE'],
  ]);
  private bannerMapper = new Map<taskCode, string>([
    [taskCode.R2E09_00_1A, 'AUCTION.MSG_BANNER_R2E09_00_1A'],
    [taskCode.R2E09_00_01_1A, 'AUCTION.MSG_BANNER_R2E09_00_01_1A'],
    [taskCode.R2E05_561_A_MOCK, 'AUCTION.MSG_BANNER_R2E05_561_A_MOCK'],
    [taskCode.R2E09_02_3B, 'AUCTION.MSG_BANNER_R2E09_02_3B'],
    [taskCode.R2E09_06_7C, 'AUCTION.MSG_BANNER_R2E09_06_7C'],
    [taskCode.R2E09_04_01_11, 'AUCTION.MSG_BANNER_R2E09_04_01_11'],
    [taskCode.R2E09_06_12C, 'AUCTION.MSG_BANNER_R2E09_06_12C'],
    [taskCode.R2E09_05_01_12A, 'AUCTION.MSG_BANNER_R2E09_05_01_12A'],
    [auctionActionCode.R2E09_2_A as taskCode, 'AUCTION.MSG_BANNER_AUCTION_R2E09_2_A'],
    [auctionActionCode.R2E09_4 as taskCode, 'AUCTION.MSG_BANNER_AUCTION_R2E09_4'],
    [taskCode.R2E09_06_03, 'AUCTION.MSG_BANNER_R2E09_06_03'],
    [taskCode.R2E11_LEXS2_552, 'AUCTION.MSG_BANNER_R2E11_LEXS2_552'],
    [taskCode.R2E09_10_01, 'AUCTION.MSG_BANNER_R2E09_10_01'],
    [taskCode.R2E09_10_02, 'AUCTION.MSG_BANNER_R2E09_10_02'],
    [taskCode.R2E09_10_03, 'AUCTION.MSG_BANNER_R2E09_10_03'],
    [taskCode.R2E09_08_01_3_1, 'AUCTION.MSG_BANNER_R2E09_08_01_3_1'],
    [taskCode.R2E09_09_01_13_1, 'AUCTION.MSG_BANNER_R2E09_09_01_13_1'],
    [taskCode.R2E09_09_03_14_1, 'AUCTION.MSG_BANNER_R2E09_09_03_14_1'],
    [taskCode.R2E35_02_E09_01_7A, 'AUCTION.MSG_BANNER_R2E35_02_E09_01_7A'],
    [taskCode.R2E35_02_E09_02_7B, 'AUCTION.MSG_BANNER_R2E35_02_E09_02_7B'],
    [auctionActionCode.PENDING_NEW_ANNOUNCE as taskCode, 'AUCTION.MSG_BANNER_PENDING_NEW_ANNOUNCE'],
    [auctionActionCode.PENDING_NEW_DEEDGROUP as taskCode, 'AUCTION.MSG_BANNER_PENDING_NEW_DEEDGROUP'],
    [auctionActionCode.PENDING_NEW_VALIDATE as taskCode, 'AUCTION.MSG_BANNER_PENDING_NEW_VALIDATE'],
  ]);

  private iconMapper = new Map<taskCode | string, string>([
    [taskCode.R2E09_00_1A, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_00_01_1A, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E05_561_A_MOCK, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_02_3B, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_06_7C, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_04_01_11, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_06_12C, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_05_01_12A, this.ICON_TYPE.TASK_LIST],
    [auctionActionCode.R2E09_2_A as taskCode, this.ICON_TYPE.LIST_MUTILPLE],
    [auctionActionCode.R2E09_4 as taskCode, this.ICON_TYPE.TASK_LIST],
    [AuctionMenu.CASHIER, this.ICON_TYPE.MONEY_HAND],
    [AuctionMenu.VIEW_CASHIER, this.ICON_TYPE.LIST_CHEQUE],
    [AuctionMenu.UPLOAD_DOC, this.ICON_TYPE.UPLOAD],
    [taskCode.R2E09_10_01, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_10_02, this.ICON_TYPE.TASK_LIST],
    [taskCode.R2E09_10_03, this.ICON_TYPE.TASK_LIST],
    [AuctionMenu.VIEW_ACCOUNT, this.ICON_TYPE.ICON_LIST],
    [AuctionMenu.ACCOUNT_DOCUMENT, this.ICON_TYPE.DOCUMENT_TEXT],
  ]);

  public auctionNumber = '';
  public auctionStatus = '';
  public prefixAuctionStatus = 'PREFIX_AUCTION_STATUS.ANNOUNCE';
  public auctionStatusCode: AuctionStatus = '' as AuctionStatus;
  public auctionMathchingStatus: AuctionMathchingStatus = '' as AuctionMathchingStatus;
  public litigationCaseShortDetail!: LitigationCaseShortDto;
  public caseDetailTitle = 'TITLE_MSG.CASE_DETAIL';
  public auctionDetailTitle = '';
  public auctionMenu!: AuctionMenu;
  // public debtSettlementAccountList: AuctionDebtSettlementAccountResponse | undefined;

  private subs = new SubSink();

  documentDto: DocumentDto | null | undefined;

  constructor(
    private taskService: TaskService,
    private routerService: RouterService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
    private litigationCaseService: LitigationCaseService,
    private auctionPaymentService: AuctionPaymentService,
    private budismPipe: BuddhistEraPipe,
    private logger: LoggerService,
    private auctionLedCardService: AuctionLedCardService,
    private auctionDetailItemPaymentResultService: AuctionDetailItemPaymentResultService,
    private route: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private newAuctionService: NewAuctionService,
    private externalDocumentsService: ExternalDocumentsService,
  ) {
    this.auctionPaymentService.currentDocumentDto.subscribe(docDto => {
      this.documentDto = docDto;
    });
  }

  ngOnInit(): void {
    this.auctionMenu = this.auctionService?.auctionMenu as AuctionMenu;
    this.mode = this.auctionService.mode as TMode;
    console.log('this.mode', this.mode);
    this.taskCode = this.taskService.taskDetail?.taskCode as taskCode;
    this.statusCode = this.taskService.taskDetail?.statusCode || '';
    // auctionCaseTypeCode:
    // 1. Coming from litigation detail -> get from queryParams
    // 2. NOT Coming from litigation detail -> get from auction service
    this.auctionCaseTypeCode = this.auctionService.auctionCaseTypeCode || this.routerService.activeRoute.snapshot.queryParams['auctionCaseTypeCode'] || '';
    this.litigationCaseId = this.taskService?.taskDetail?.litigationCaseId || this.routerService.activeRoute.snapshot.queryParams['litigationCaseId'] || '';
    this.initPermission();
    this.mappingPageTitle();
    this.mappingPageBanner();
    this.mappingPageIcon();
    this.litigationCaseShortDetail = this.litigationCaseService.litigationCaseShortDetail;
    this.initActionBarStatus();
    this.initTaskScreenStatus();
    this.onRouterLink();

    this.initActionBar();
    this.checkDateEligibility();

    this.subs.add(
      // fix view not update incase of share the same container
      this.route.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (
            event.url.indexOf('/auction-detail') > -1 ||
            event.url.indexOf('/auction-result-info') > -1 ||
            event.url.indexOf('/property-set-buyer') > -1 ||
            event.url.indexOf('/auction-item-payment-result') > -1
          ) {
            this.mappingPageIcon();
            this.mappingPageTitle();
            this.initActionBarStatus();
            this.mappingPageBanner();
            this.initTaskScreenStatus();
            this.initActionBar();
            this.checkDateEligibility();
          }
        }
      }),

      this.auctionService.triggerUpdateActionBar.subscribe(value => {
        if (value) {
          this.initActionBar();
        }
      }),

      this.auctionPaymentService?.paymentOrderFormGroup?.get('status')?.valueChanges.subscribe(value => {
        this.logger.info('auctionPaymentService?.paymentOrderFormGroup', value);
        if (this.taskCode === taskCode.R2E09_02_3B) {
          this.auctionStatus = `TASK_CODE_STATUS.${value}`;
        }
      })
    );

    console.log('taskCode', this.taskCode);
    console.log('auctionStatusCode', this.auctionStatusCode);
    console.log('auctionCaseTypeCode', this.auctionCaseTypeCode);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initActionBarStatus() {
    if (this.taskCode === taskCode.R2E09_04_01_11 && this.isAuctionSubmitResultLanding) {
      this.statusName = '';
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.isItemPaymentResult) {
      this.statusName = '';
    } else if (this.taskCode === taskCode.R2E09_10_02) {
      this.statusName = 'รอพิจารณารายการตัดบัญชี';
    } else if (this.taskCode === taskCode.R2E09_06_03) {
      switch (this.statusCode) {
        case 'PENDING':
          this.statusName = 'รอบันทึกออกแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        case 'CORRECT_PENDING':
          this.statusName = 'รอแก้ไขข้อมูลแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        case 'PENDING_REVIEW':
          this.statusName = 'รอออกแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        case 'PENDING_APPROVAL':
          this.statusName = 'รออนุมัติแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        default:
          break;
      }
    } else if (
      this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')
    ) {
      this.statusName = 'เพิ่มประกาศขายทอดตลาด';
    } else {
      this.statusName = this.taskService.taskDetail?.statusName || '';
    }
  }

  private mappingPageBanner() {
    if (
      (this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
        this.auctionService.actionType !== taskCode.ON_REQUEST &&
        (this.auctionService.mode === 'VIEW' || this.auctionService.mode === 'EDIT')) ||
      this.mode === 'VIEW'
    ) {
      this.messageBanner = '';
    } else if (this.taskCode === taskCode.R2E09_04_01_11 && this.isAuctionSubmitResultLanding) {
      this.auctionService.hideContentHeader = false;
      if (
        [AuctionResultSubmitStatus.SOLD].includes(
          this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.aucResult as AuctionResultSubmitStatus
        ) &&
        this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument
      ) {
        this.messageBanner =
          'กรุณาบันทึกเอกสารขายทอดตลาดและเอกสารส่งให้หน่วยงานดูแลลูกหนี้ และกดปุ่ม “บันทึกผล” เพื่อดำเนินการต่อไป';
      } else if (
        [AuctionResultSubmitStatus.UNSOLD, AuctionResultSubmitStatus.CANCEL].includes(
          this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.aucResult as AuctionResultSubmitStatus
        ) &&
        this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument
      ) {
        this.messageBanner = 'กรุณาบันทึกเอกสารส่งให้หน่วยงานดูแลลูกหนี้ และกดปุ่ม “บันทึกผล” เพื่อดำเนินการต่อไป';
      } else if (
        this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.aucResult ===
          AuctionResultSubmitStatus.SOLD &&
        !this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument
      ) {
        this.messageBanner = 'หากมีการอัปโหลดหรือแก้ไขเอกสารระบบจะทำการบันทึกโดยอัตโนมัติ';
      } else if (
        [AuctionResultSubmitStatus.CANCEL, AuctionResultSubmitStatus.UNSOLD].includes(
          this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.aucResult as AuctionResultSubmitStatus
        ) &&
        !this.auctionService.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument
      ) {
        this.messageBanner = '';
      } else {
        this.messageBanner = 'กรุณาบันทึกผลขายทอดตลาด และกดปุ่ม “บันทึกผล” เพื่อดำเนินการต่อไป';
      }
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.isItemPaymentResult) {
      this.messageBanner = 'กรุณาบันทึกผลการชำระเงิน และกดปุ่ม “บันทึกเสร็จสิ้น” เพื่อดำเนินการต่อไป';
    } else if (
      this.taskCode === taskCode.R2E09_06_7C &&
      ['PENDING_REVIEW', 'PENDING_APPROVAL'].includes(this.statusCode)
    ) {
      switch (this.statusCode) {
        case 'PENDING_REVIEW':
          this.messageBanner = 'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.MSG_BANNER_FOR_PENDING_REVIEW';
          break;
        case 'PENDING_APPROVAL':
          this.messageBanner = 'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.MSG_BANNER_FOR_PENDING_APPROVAL';
          break;
      }
    } else if (
      this.taskCode === taskCode.R2E09_06_12C &&
      ['PENDING_REVIEW', 'PENDING_APPROVAL'].includes(this.statusCode)
    ) {
      switch (this.statusCode) {
        case 'PENDING_REVIEW':
          this.messageBanner = 'AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.MSG_BANNER_FOR_PENDING_REVIEW';
          break;
        case 'PENDING_APPROVAL':
          this.messageBanner = 'AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.MSG_BANNER_FOR_PENDING_APPROVAL';
          break;
      }
    } else if (this.taskCode == taskCode.R2E09_06_03 && !['PENDING'].includes(this.statusCode)) {
      switch (this.statusCode) {
        case 'CORRECT_PENDING':
          this.messageBanner =
            'กรุณาตรวจสอบเหตุผลส่งกลับแก้ไขและแก้ไขรายละเอียดแคชเชียร์เช็คเพิ่มเติมตามหมายบังคับคดี และกดปุ่ม “นำเสนอ” เพื่อดำเนินการต่อไป';
          break;
        case 'PENDING_REVIEW':
          this.messageBanner =
            'กรุณาตรวจสอบรายละเอียดแคชเชียร์เช็ควางเงินเพิ่ม และกดปุ่ม “นำเสนอ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
          break;
        case 'PENDING_APPROVAL':
          this.messageBanner =
            'กรุณาตรวจสอบรายละเอียดแคชเชียร์เช็คเพิ่มเติมตามหมายบังคับคดีและกดปุ่ม  “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
          break;
      }
    } else if (this.taskCode === taskCode.R2E35_02_E09_02_7B && ['AWAITING'].includes(this.statusCode)) {
      this.messageBanner =
        'กรุณาตรวจสอบเหตุผลส่งกลับแก้ไขและแก้ไขรายละเอียดใบเสร็จค่าใช้จ่ายเพิ่มเติมและกดปุ่ม “เสร็จสิ้น” เพื่อดำเนินการต่อไป';
    } else if (
      this.taskCode === taskCode.R2E09_14_3C &&
      ['PENDING_REVIEW', 'PENDING_APPROVAL', 'CORRECT_PENDING'].includes(this.statusCode)
    ) {
      switch (this.statusCode) {
        case 'PENDING_REVIEW':
          this.messageBanner =
            'กรุณาตรวจสอบรายละเอียดแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติม และกดปุ่ม “นำเสนอ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
          break;
        case 'PENDING_APPROVAL':
          this.messageBanner =
            'กรุณาตรวจสอบรายละเอียดแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติม และกดปุ่ม “อนุมัติ” หรือ “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
          break;
        case 'CORRECT_PENDING':
          this.messageBanner =
            'กรุณาตรวจสอบเหตุผลส่งกลับแก้ไขและแก้ไขรายละเอียดใบเสร็จค่าใช้จ่ายเพิ่มเติมและกดปุ่ม "นำเสนอ" เพื่อดำเนินการต่อไป';
          break;
      }
    } else {
      this.messageBanner = this.bannerMapper.get(this.taskCode || this.auctionService.actionCode) || '';
    }
  }

  private mappingPageIcon() {
    if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      this.taskIcon = 'icon-Document-Add';
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
      this.auctionService.actionType !== taskCode.ON_REQUEST &&
      this.auctionService.mode === 'VIEW'
    ) {
      this.taskIcon = this.ICON_TYPE.VIEW_CASHIER;
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
      this.auctionService.actionType !== taskCode.ON_REQUEST &&
      this.auctionService.mode === 'EDIT'
    ) {
      this.taskIcon = this.ICON_TYPE.TASK_LIST;
    } else if (this.auctionMenu === AuctionMenu.VIEW_PAYMENT) {
      this.taskIcon = this.ICON_TYPE.VIEW_PAYMENT;
    } else if (this.auctionService.auctionMenu === AuctionMenu.REVOKE) {
      this.taskIcon = 'icon-Money-Cancel';
    } else if (this.auctionMenu === AuctionMenu.VIEW_CASHIER) {
      this.taskIcon = this.ICON_TYPE.LIST_MUTILPLE;
    } else if (this.taskCode === taskCode.R2E09_04_01_11 && this.isAuctionSubmitResultLanding) {
      this.taskIcon = this.ICON_TYPE.AUCTION_SUBMIT;
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.isItemPaymentResult) {
      this.taskIcon = this.ICON_TYPE.AUCTION_SUBMIT;
    } else if (
      this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')
    ) {
      this.taskIcon = 'icon-Document-Add';
    } else {
      this.taskIcon =
        this.iconMapper.get(this.taskCode || this.auctionService.actionCode || this.auctionMenu) ||
        this.ICON_TYPE.TASK_LIST;
    }
  }

  private mappingPageTitle() {
    if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      this.title = 'บันทึกค่าใช้จ่ายเพิ่มเติม';
    } else if (this.auctionMenu === AuctionMenu.VIEW_PAYMENT) {
      this.title = 'ค่าใช้จ่ายประกาศขายทอดตลาด';
    } else if (this.auctionService.auctionMenu === AuctionMenu.REVOKE) {
      this.title = 'เพิกถอนการขาย';
    } else if (this.taskCode === taskCode.R2E09_06_7C && this.statusCode !== 'PENDING') {
      switch (this.statusCode) {
        case 'CORRECT_PENDING':
          this.title = 'AUCTION.TITLE_R2E09_06_7C_CORRECT_PENDING';
          break;
        case 'PENDING_REVIEW':
          this.title = 'AUCTION.TITLE_R2E09_06_7C_PENDING_REVIEW';
          break;
        case 'PENDING_APPROVAL':
          this.title = 'AUCTION.TITLE_R2E09_06_7C_PENDING_APPROVAL';
          break;
      }
    } else if (this.taskCode === taskCode.R2E09_06_12C && this.statusCode !== 'PENDING') {
      switch (this.statusCode) {
        case 'CORRECT_PENDING':
          this.title = 'AUCTION.TITLE_R2E09_06_12C_CORRECT_PENDING';
          break;
        case 'PENDING_REVIEW':
          this.title = 'AUCTION.TITLE_R2E09_06_12C_PENDING_REVIEW';
          break;
        case 'PENDING_APPROVAL':
          this.title = 'AUCTION.TITLE_R2E09_06_12C_PENDING_APPROVAL';
          break;
      }
    } else if (this.taskCode === taskCode.R2E09_04_01_11 && this.isAuctionSubmitResultLanding) {
      this.title = 'บันทึกผล';
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.isItemPaymentResult) {
      this.title = 'บันทึกผลการติดตามการชำระเงิน';
    } else if (this.taskCode === taskCode.R2E09_06_03) {
      switch (this.statusCode) {
        case 'PENDING':
        case 'PENDING_REVIEW':
          this.title = 'ออกแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        case 'CORRECT_PENDING':
          this.title = 'ออกแคชเชียร์เช็ควางเงินเพิ่ม';
          break;
        case 'PENDING_APPROVAL':
          this.title = 'พิจารณาอนุมัติแคชเชียร์เช็ค';
          break;
        default:
          break;
      }
    } else if (this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')) {
      this.title = 'เพิ่มประกาศขายทอดตลาด';
    } else if (this.taskCode === taskCode.R2E09_14_3C && this.statusCode === 'PENDING_REVIEW') {
      this.title = 'AUCTION.TITLE_R2E09_14_3C_PENDING_REVIEW'
    } else if (this.taskCode === taskCode.R2E09_14_3C && this.statusCode === 'PENDING_APPROVAL') {
      this.title = 'AUCTION.TITLE_R2E09_14_3C_PENDING_APPROVAL'
    } else {
      this.title = this.titleMapper.get(this.taskCode || this.auctionService.actionCode || this.auctionMenu) || '';
    }
  }

  onRouterLink() {
    if (this.mode === 'ADD' || this.auctionMenu === AuctionMenu.VIEW_PAYMENT) {
      this.routerService.navigateTo(`${MAIN_ROUTES.LAWSUIT}/auction/auction-advance-payment`);
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A ||
      this.auctionService.actionCode === auctionActionCode.R2E09_4
    ) {
      this.routerService.navigateTo(`${MAIN_ROUTES.EXTERNAL_DOCUMENTS}/auction/auction-annoucement-detail`);
    } else if(
      [
        auctionActionCode.PENDING_NEW_ANNOUNCE,
        auctionActionCode.PENDING_NEW_DEEDGROUP,
        auctionActionCode.PENDING_NEW_VALIDATE,
      ].includes(this.auctionService.actionCode as any)
    ) {
      this.routerService.navigateTo(`${MAIN_ROUTES.EXTERNAL_DOCUMENTS}/auction/auction-manual-announcement`);
    }

    else {
      const mainPath = `/${this.routerService.findRootMenu(this.routerService.currentRoute)}/auction`;
      const params = this.routerService.paramMapp.get(mainPath);
      switch (this.taskCode) {
        case taskCode.R2E09_00_1A:
        case taskCode.R2E09_00_01_1A:
        case taskCode.R2E05_561_A_MOCK:
        case taskCode.R2E09_06_7C:
        case taskCode.R2E09_06_12C:
        case taskCode.R2E09_08_01_3_1:
        case taskCode.R2E09_10_01:
        case taskCode.R2E09_10_02:
        case taskCode.R2E09_10_03:
        case taskCode.R2E09_09_01_13_1:
        case taskCode.R2E09_09_03_14_1:
        case taskCode.R2E09_06_03:
          // case taskCode.R2E10_01_02:
          // case taskCode.R2E10_01_03:
          this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/auction/auction-detail`, params);
          // this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/auction/auction-detail`);
          break;
        case taskCode.R2E09_02_3B:
          // Naviagate to [LEX2-496] งานสร้างและชำระค่าใช้จ่ายประกาศขายทอดตลาด
          this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/auction/auction-advance-payment`);
          break;
        case taskCode.R2E09_05_01_12A:
          // const mainPath = `/${this.routerService.findRootMenu(this.routerService.currentRoute)}/auction`;
          // const params = this.routerService.paramMapp.get(mainPath);
          this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/auction/property-set-buyer`, params);
          break;
        // case taskCode.R2E09_04_01_11:
        //   this.routerService.navigateTo(`${MAIN_ROUTES.TASK}/auction/auction-result-info`);
        // Naviagate to [LEX2-518] - งานบันทึกผลการขายของแต่ละนัด
        // Navigate to [LEX2-542] งานบันทึกติดตามผลการชำระเงิน
        default:
          break;
      }
    }
  }

  checkDateEligibility() {
    if (
      (((this.taskCode === taskCode.R2E09_06_7C ||
        this.taskCode === taskCode.R2E09_06_12C ||
        this.taskCode === taskCode.R2E09_06_03 ||
        this.taskCode === taskCode.R2E09_14_3C) &&
        ['PENDING_REVIEW', 'PENDING_APPROVAL'].includes(this.statusCode)) ||
        (this.taskCode === taskCode.R2E09_10_02 && ['PENDING'].includes(this.statusCode))) &&
      this.isOwnerTask
    ) {
      let formData;
      switch (this.taskCode) {
        case taskCode.R2E09_06_7C:
          formData = this.auctionService.collateralForm.getRawValue();
          break;
        case taskCode.R2E09_06_12C:
          formData = this.auctionService.stampDutyForm.getRawValue();
          break;
        case taskCode.R2E09_06_03:
          formData = this.auctionService.cashCourtForm.getRawValue();
          break;
        case taskCode.R2E09_14_3C:
          formData = this.auctionPaymentService.paymentNonEFilingFormGroup.getRawValue();
      }
      let prePayload: any;
      if (this.taskCode === taskCode.R2E09_14_3C) {
        prePayload = formData;
      } else {
        prePayload = formData?.cashierCheque?.find((it: any) => {
          return it.actionFlag;
        });
      }

      if (
        moment(prePayload?.receiveCashierDate).startOf('day').isBefore(moment().startOf('day')) ||
        (this.taskCode === taskCode.R2E09_10_02 && !this.auctionService.debtSettlement?.isAllowedApprove)
      ) {
        this.messageBanner = '';
        if (this.taskCode === taskCode.R2E09_10_02) {
          this.errorBannerMsg =
            'เนื่องจากเกินกำหนดวันในการพิจารณารายการตัดบัญชี กรุณากดปุ่ม “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
        } else {
          this.errorBannerMsg =
            'เนื่องจากเกินกำหนดวัน “วันที่ไปรับแคชเชียร์เช็ค/วันที่สั่งจ่าย” กรุณากดปุ่ม “ส่งกลับแก้ไข” เพื่อดำเนินการต่อไป';
        }
        this.actionBar.hasPrimary = false;
      }
    }
  }

  private tempLatestUrl = ''; // TODO: pallop work-around temporary to fix bug LEX2-28841
  async onBack() {
    if (this.actionCode) { // LEX2-MVP3: added control back button by actionCode
      if (this.isInNewAuctionActionEdit(this.actionCode)) {
        if (this.newAuctionService.isFormsDirty(this.actionCode as AuctionCreateAnnounceSubmitRequest.MatchStatusEnum)) {
          if (!(await this.sessionService.confirmExitWithoutSave())) return;
        }
        this.externalDocumentsService.announceKtbTab = 1;
        this.routerService.back();
        return;
      }
    }

    if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      if (this.auctionPaymentService.isPaymentOrderFormTouched) {
        await this.auctionService.openConfirmBackToEdit(false);
      } else {
        this.routerService.back();
      }
    } else if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.CASHIER:
          if (this.auctionService?.cashCourtForm?.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        default:
          this.routerService.back();
          break;
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E09_06_7C:
          if (this.auctionService.collateralForm.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_06_12C:
          if (this.auctionService.stampDutyForm.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_00_1A:
          if (this.auctionService.lawyerForm.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_00_01_1A:
          if (this.auctionService.lawyerForm.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_02_3B:
          if (this.auctionPaymentService.isPaymentOrderFormTouched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_04_01_11:
          if (this.isAuctionSubmitResultLanding) {
            this.auctionService.itemActionCode = '' as SubmitAuctionResultAction;
          }
          if (this.auctionService?.auctionSubmitResultPerCollateralForm?.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
            this.auctionService.submitResultStatus = false;
          }
          break;
        case taskCode.R2E05_561_A_MOCK:
          if (this.auctionService.lawyerForm.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_10_01:
        case taskCode.R2E09_10_02:
        case taskCode.R2E09_10_03:
          this.routerService.back();
          break;
        case taskCode.R2E09_05_01_12A:
          if (this.auctionDetailItemPaymentResultService.collateralGroupForm?.touched) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        case taskCode.R2E35_02_E09_01_7A:
          const formValid = this.auctionPaymentService.onTest;
          if (formValid.touched || formValid.value) {
            await this.auctionService.openConfirmBackToEdit(false);
          } else {
            this.routerService.back();
          }
          break;
        default:
          this.routerService.back();
          break;
      }
    }
  }

  async onEdit() {
    if (this.auctionService.actionCode === auctionActionCode.R2E09_2_A && this.auctionService.mode === 'EDIT') {
      this.cancelCollateralMatching();
    } else {
      let foundLawyer: LexsUserOption | undefined = {};
      if (this.litigationCaseService.litigationCaseShortDetail.auctionLawyerIdNonPledgeAssets) {
        foundLawyer = this.userService.kLawyerUserOptions.find(
          item => item.userId === this.litigationCaseService.litigationCaseShortDetail.auctionLawyerIdNonPledgeAssets
        );
      } else {
        foundLawyer = this.userService.kLawyerUserOptions.find(
          item => item.userId === this.litigationCaseService.litigationCaseShortDetail.publicAuctionLawyerId
        );
      }
      const lawyerFullName = foundLawyer ? `${foundLawyer.userId} - ${foundLawyer.name} ${foundLawyer.surname}` : '';
      // const makerFullName =
      switch (this.taskCode) {
        case taskCode.R2E09_06_7C:
        case taskCode.R2E09_06_12C:
        case taskCode.R2E09_09_03_14_1:
        case taskCode.R2E09_06_03:
          let formData: any;
          switch (this.taskCode) {
            case taskCode.R2E09_06_7C:
              formData = this.auctionService.collateralForm?.getRawValue();
              break;
            case taskCode.R2E09_06_12C:
              formData = this.auctionService.stampDutyForm?.getRawValue();
              break;
            case taskCode.R2E09_06_03:
              formData = this.auctionService.cashCourtForm?.getRawValue();
              break;
          }
          const prePayload = formData?.cashierCheque.find((it: any) => {
            return it.actionFlag;
          });
          const getLawyer = this.auctionService.mapLawyer();
          const auctionCollateralId = Number(this.taskService.taskDetail.objectId);
          const lawyerName = getLawyer.find((data: any) => prePayload?.assignedLawyerId === data.value)?.name;
          const maker =
            this.taskCode === taskCode.R2E09_09_03_14_1
              ? this.auctionService.accountDocFollowupForm?.get('submitUser')?.value
              : null;
          const context = {
            lawyer: lawyerName || '-',
            auctionCollateralId: auctionCollateralId,
            maker,
          };
          const dialog = await this.notificationService.showCustomDialog({
            component: RejectAuctionCashierChequeDialogComponent,
            title: 'COMMON.LABEL_SEND_BACK_EDIT',
            iconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            context: context,
          });
          if (dialog && dialog.isSuccess) {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_10_02:
          const debtSettlement = this.auctionService.debtSettlement;
          const contextDebt = {
            lawyer: debtSettlement?.makerId + '-' + debtSettlement?.makerName || '-',
            auctionCollateralId: debtSettlement?.makerId,
          };
          const res = await this.notificationService.showCustomDialog({
            component: RejectAuctionCashierChequeDialogComponent,
            title: 'COMMON.LABEL_SEND_BACK_EDIT',
            iconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            context: contextDebt,
          });
          if (res && res.isSuccess) {
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_14_3C:
          const contextNonEFiling = {
            lawyer: lawyerFullName,
            auctionExpenseId: this.auctionService.auctionExpenseInfo?.id,
          };
          const dialogNonEFiling = await this.notificationService.showCustomDialog({
            component: RejectAuctionCashierChequeDialogComponent,
            title: 'COMMON.LABEL_SEND_BACK_EDIT',
            iconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            context: contextNonEFiling,
          });
          if (dialogNonEFiling && dialogNonEFiling.isSuccess) {
            this.routerService.back();
          }
          break;
        case taskCode.R2E35_02_E09_02_7B:
          const efilingInvoiceMakerInfo = this.auctionPaymentService.auctionExpenseNonEFilingInvoice;
          console.log('efiling non', efilingInvoiceMakerInfo);
          const makerFullName = efilingInvoiceMakerInfo
            ? `${efilingInvoiceMakerInfo.makerId} - ${efilingInvoiceMakerInfo.makerName}`
            : '';
          const contextReceiptUploadNonEFiling = {
            lawyer: makerFullName,
            auctionExpenseId: this.auctionService.auctionExpenseInfo?.id,
          };
          const dialogReceiptNonEFiling = await this.notificationService.showCustomDialog({
            component: RejectAuctionCashierChequeDialogComponent,
            title: 'COMMON.LABEL_SEND_BACK_EDIT',
            iconName: 'icon-Arrow-Revert',
            rightButtonClass: 'long-button mat-warn',
            buttonIconName: 'icon-Arrow-Revert',
            rightButtonLabel: 'COMMON.CONFIRM_SEND_BACK_EDIT',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            cancelEvent: true,
            context: contextReceiptUploadNonEFiling,
          });
          if (dialogReceiptNonEFiling && dialogReceiptNonEFiling.isSuccess) {
            this.routerService.back();
          }
          break;
      }
    }
  }

  async onSave() {
    if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.CASHIER:
          try {
            const request: AuctionCashierAdditionalPaymentSubmitRequest =
              this.getAuctionCashierAdditionalPaymentSubmitRequest('DRAFT');
            let res = await this.auctionService.submitAuctionCashierAdditionalPayment(request);
            this.additionalPaymentCashierId = res.additionalPaymentCashierId || 0;
            this.auctionService.cashCourtForm.markAsUntouched({
              onlySelf: false,
            });
            this.notificationService.openSnackbarSuccess('บันทึกแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
          } catch (e) {}
          break;

        default:
          break;
      }
    } else if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      if (
        this.auctionService.auctionPaymentType === 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE' ||
        this.auctionService.auctionPaymentType === 'WRIT_OF_EXECUTE_CASHIER_CHEQUE'
      ) {
        await this.submitAuctionExpenseNonEFiling('DRAFT');
      }
    } else if (this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')) {
      const req = this.newAuctionService.getAuctionCreateAnnounceSubmitRequest('SAVE');

      try {
        await this.newAuctionService.postCreateAnnounceSubmit(this.newAuctionService.aucRef, req);

        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('COMMON.LABEL_SAVE_DRAFT')
        );

        this.newAuctionService.setFormsToPristine();
      } catch (e) {
        this.notificationService.openSnackbarError(
          this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR'));
      }
    } else {
      switch (this.taskCode) {
        case taskCode.R2E09_06_7C:
          const formData = this.auctionService.collateralForm.getRawValue();
          const prePayload = formData?.cashierCheque.find((it: any) => it.actionFlag === true);
          if (
            this.validateBranchOpenDate(
              this.auctionService.collateralForm.controls['cashierCheque'] as UntypedFormArray,
              prePayload,
              formData
            )
          )
            return;
          const payload: AuctionCashierCollateralRequest = {
            headerFlag: 'DRAFT',
            assignedLawyerId: prePayload.assignedLawyerId || '',
            assignedLawyerMobileNo: prePayload.assignedLawyerMobileNo || '',
            branchCode: prePayload.branchCode || '',
            cashierCollateralId: Number(prePayload.cashierCollateralId),
            receiveCashierDate: prePayload.receiveCashierDate || '',
            receivedByLawyerId: prePayload.receivedByLawyerId || '',
            receivedByLawyerMobileNo: prePayload.receivedByLawyerMobileNo || '',
          };
          await this.auctionService.postAuctionCashierSubmit(payload);
          this.auctionService.collateralForm.markAsUntouched({
            onlySelf: false,
          });
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.SAVED_SUCCESSFULLY')
          );
          break;
        case taskCode.R2E09_06_12C:
          await this.saveCashierChequeStampDuty();
          break;
        case taskCode.R2E09_08_01_3_1:
          const conveyanceDocUploadId: number = Number(this.taskService.taskDetail.objectId);
          const taskId = Number(this.taskService.taskDetail.id);
          const req: ConveyanceUploadDocumentRequest = this.getConveyanceUploadDocumentRequest();
          const request: AuctionResultRecordingSubmitRequest = {
            headerFlag: 'DRAFT',
            conveyanceDeedGroupDocuments: req.conveyanceDeedGroupDocuments,
            conveyanceOptionalUploadDocuments: req.conveyanceOptionalUploadDocuments,
          };
          let res = (await this.auctionLedCardService.auctionResultRecordingSubmit(
            conveyanceDocUploadId,
            taskId,
            request
          )) as ConveyanceUploadDocumentResponse;
          this.logger.info('auctionResultRecordingSubmit :: ', res);
          this.notificationService.openSnackbarSuccess('บันทึกเอกสารจากการซื้อทรัพย์แล้ว');

          break;
        case taskCode.R2E09_10_01:
        case taskCode.R2E09_10_03: {
          this.submitAuctionDebtSettlement('DRAFT');
          this.auctionService?.debtForm.markAsPristine();
          this.auctionService?.debtForm.updateValueAndValidity();
          break;
        }
        case taskCode.R2E09_06_03:
          try {
            const request: AuctionCashierAdditionalPaymentSubmitRequest =
              this.getAuctionCashierAdditionalPaymentSubmitRequest('DRAFT');
            await this.auctionService.submitAuctionCashierAdditionalPayment(request);
            this.auctionService.cashCourtForm.markAsUntouched({
              onlySelf: false,
            });
            this.notificationService.openSnackbarSuccess('บันทึกแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
            this.routerService.back();
          } catch (e) {}
          break;
        case taskCode.R2E09_14_3C:
          await this.submitAuctionExpenseNonEFiling('DRAFT');
          break;
        default:
          break;
      }
    }
  }

  private async saveCashierChequeStampDuty() {
    const formData = this.auctionService.stampDutyForm.getRawValue();
    let index = -1;
    const prePayload = formData?.cashierCheque.find((it: any, i: number) => {
      if (it.actionFlag) {
        index = i;
        return it.actionFlag;
      }
    });
    if (
      this.validateBranchOpenDate(
        this.auctionService.stampDutyForm.controls['cashierCheque'] as UntypedFormArray,
        prePayload,
        formData
      )
    )
      return;
    const payload: AuctionCashierStampDutySubmitRequest = {
      headerFlag: 'DRAFT',
      cashierStampDutyId: prePayload.cashierStampDutyId || '',
      assignedLawyerId: prePayload.assignedLawyerId || '',
      assignedLawyerMobileNo: prePayload.assignedLawyerMobileNo || '',
      initBy: this.sessionService.currentUser?.userId,
      receivedByLawyerId: prePayload.receivedByLawyerId || '',
      receivedByLawyerMobileNo: prePayload.receivedByLawyerMobileNo || '',
      branchCode: prePayload.branchCode || '',
      receiveCashierDate: prePayload.receiveCashierDate || '',
    };
    const response = await this.auctionService.postSubmitAuctionCashierChequeStampDuty(payload);
    const cashierCheque = this.auctionService.stampDutyForm.get('cashierCheque') as UntypedFormArray;
    if (index > -1) {
      cashierCheque.at(index).setValue({
        ...prePayload,
        cashierStampDutyId: response.cashierStampDutyId,
      });
    }
    this.auctionService.stampDutyForm.markAsUntouched();
    this.notificationService.openSnackbarSuccess(
      this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.SAVED_SUCCESSFULLY')
    );
  }

  async onSubmit() {
    const auctionExpenseId = this.auctionService.auctionExpenseInfo?.id || 0;
    if (this.auctionService.actionCode === auctionActionCode.R2E09_2_A && this.auctionService.mode === 'EDIT') {
      // LEX2-42660 MVP3 Enhance to math via pop-up
      const response = await this.auctionService.getAuctionLexsSeizures();
      this.auctionService.auctionLexsSeizures = response;

      const result = await this.notificationService.showCustomDialog({
        component: AucAnnounementMatchDialogComponent,
        title: 'รายละเอียดคดีที่ต้องการจับคู่',
        hideIcon: true,
        rightButtonLabel: 'AUC_ANNOUNEMENT_MAP_COLLATERAL.VERIFIED_MAP',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        buttonIconName: 'icon-Check-Square',
        context: {
          auctionLexsSeizures: this.auctionService.auctionLexsSeizures?.auctionLexsSeizures || []
        }
      });
      if (result) {
        this.notificationService.openSnackbarSuccess(this.translateService.instant('ใบประกาศจับคู่แล้ว'));
        this.routerService.back();
      }
    } else if (this.auctionService.actionCode === auctionActionCode.R2E09_4 && this.auctionService.mode === 'EDIT') {
      const _aucBiddingDocuments = this.auctionService.genaralForm.get('aucBiddingDocuments')?.getRawValue();
      if(_aucBiddingDocuments.length !== 0) {
        const _findNotUpload = _aucBiddingDocuments.findIndex((item: any) => item.documentId === 0);
        if (_findNotUpload !== -1) {
          this.auctionService.uploadAucBiddingDocuments.markAllAsTouched();
          this.auctionService.uploadAucBiddingDocuments.updateValueAndValidity();
        } else {
          await this.approveAuctionLitigationCase();
        }
      }
    } else if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      if (
        this.auctionService.auctionPaymentType === 'SUMMON_FOR_SURCHARGE_E_FILING' ||
        this.auctionService.auctionPaymentType === 'WRIT_OF_EXECUTE_E_FILING'
      ) {
        await this.submitAuctionExpense();
      } else if (
        this.auctionService.auctionPaymentType === 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE' ||
        this.auctionService.auctionPaymentType === 'WRIT_OF_EXECUTE_CASHIER_CHEQUE'
      ) {
        const formData = this.auctionPaymentService.paymentNonEFilingFormGroup.getRawValue();
        const isValid = this.validateBranchOpenDateFormControl(
          formData,
          this.auctionPaymentService.paymentNonEFilingFormGroup
        );
        if (!isValid) {
          this.submitAuctionExpenseNonEFiling('SUBMIT').then(response => {
            if (response) {
              this.routerService.back();
            }
          });
        }
      }
    } else if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.CASHIER:
          const cashCourtForm = this.auctionService?.cashCourtForm.getRawValue();
          const prePayload = cashCourtForm?.cashierCheque?.find((it: any) => it.actionFlag === true);
          if (
            this.validateBranchOpenDate(
              this.auctionService.cashCourtForm.controls['cashierCheque'] as UntypedFormArray,
              prePayload,
              cashCourtForm
            )
          ) {
            return;
          }
          this.auctionService.cashCourtForm.markAllAsTouched();
          this.auctionService.cashCourtForm.updateValueAndValidity();
          if (this.auctionService.cashCourtForm.valid) {
            try {
              const request: AuctionCashierAdditionalPaymentSubmitRequest =
                this.getAuctionCashierAdditionalPaymentSubmitRequest('SUBMIT');
              await this.auctionService.submitAuctionCashierAdditionalPayment(request);
              this.auctionService.cashCourtForm.markAsUntouched({
                onlySelf: false,
              });
              this.notificationService.openSnackbarSuccess('นำเสนอแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
              this.routerService.back();
            } catch (e) {}
          }
          break;
        case AuctionMenu.UPLOAD_DOC:
          const data = this.auctionService?.conveyanceDocumentUploads;
          let hasImageId = data?.conveyanceUploadDocuments?.some(s => s.document?.imageId);
          if (hasImageId) {
            this.auctionService.conveyanceHasEdit = false;
            const aucRef: number = Number(this.auctionService.conveyanceDocumentUploads.aucRef);
            const request: ConveyanceUploadDocumentRequest = this.getConveyanceUploadDocumentRequest();
            let response = (await this.auctionLedCardService.postConveyanceDocumentUpload(
              aucRef,
              request
            )) as ConveyanceUploadDocumentResponse;
            if (response) {
              this.notificationService.openSnackbarSuccess('เอกสารจากการซื้อทรัพย์อัปโหลดแล้ว');
              this.routerService.navigateTo(`${CIVIL_CASE_TAB_ROUTES.AUCTION_LED_CARD_INFO_TAB}`, {
                litigationId: this.litigationCaseService.litigationCaseShortDetail.litigationId,
              });
            }
          } else {
            this.notificationService.alertDialog(
              'ไม่สามารถเสร็จสิ้นงานได้',
              'เนื่องจากยังไม่ได้ “บันทึกรายละเอียด” ของเอกสาร ที่เกี่ยวข้องจากการซื้อทรัพย์'
            );
          }

          break;
        case AuctionMenu.ACCOUNT_DOCUMENT:
          await this.callPostResultRecording();
          break;
        default:
          break;
      }
    } else if (this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')) {
      if (!this.newAuctionService.validateForms()) return;

      const req = this.newAuctionService.getAuctionCreateAnnounceSubmitRequest('SUBMIT');
      const res = await this.newAuctionService.postCreateAnnounceSubmit(this.newAuctionService.aucRef, req);

      if (!res) return;

      if (this.actionCode === 'PENDING_NEW_VALIDATE') {
        this.notificationService.openSnackbarSuccess(
          this.translateService.instant('AUCTION_MANUAL_ANNOUNCEMENT.MSG_ADDED_MANUAL')
        );
        this.routerService.back();
        return;
      }

      // refresh AuctionManualAnnouncementComponent data(in newAuctionService)
      await this.newAuctionService.setNewAuctionServiceData();

      // set new actionCode, refresh actionbar
      const matchStatus = this.newAuctionService.createAnnounceResponse?.matchStatus || undefined;
      switch (matchStatus) {
        case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce:
          this.auctionService.actionCode = auctionActionCode.PENDING_NEW_ANNOUNCE;
          break;
        case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup:
          this.auctionService.actionCode = auctionActionCode.PENDING_NEW_DEEDGROUP;
          break;
        case AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewValidate:
          this.auctionService.actionCode = auctionActionCode.PENDING_NEW_VALIDATE;
          break;
        default:
          break;
      }
      // this.initActionBarStatus();
      this.initActionBar();
      this.mappingPageBanner();
    } else {
      switch (this.taskCode) {
        case taskCode.R2E09_00_1A:
          this.auctionService.lawyerForm.markAllAsTouched();
          if (this.auctionService.lawyerForm.valid) {
            //TODO API Integration
            const taskId = Number(this.taskService.taskDetail.id);
            const rawValue = this.auctionService.lawyerForm.getRawValue();
            const request: SubmitAuctionAssignLawyerRequest = {
              userId: rawValue?.legalExecutionLawyerId || '',
            };
            await this.auctionService.postSubmitAuctionAssignLawyer(taskId, request);
            this.notificationService.openSnackbarSuccess(
              'ประกาศจากสำนักงานบังคับคดีจังหวัดสมุทรสาคร มอบหมายทนายความแล้ว'
            );
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_00_01_1A:
          this.auctionService.lawyerForm.markAllAsTouched();
          if (this.auctionService.lawyerForm.valid) {
            //TODO API Integration
            const taskId = Number(this.taskService.taskDetail.id);
            const rawValue = this.auctionService.lawyerForm.getRawValue();
            const request: SubmitAuctionAssignLawyerRequest = {
              userId: rawValue?.legalExecutionLawyerId || '',
            };
            await this.auctionService.postSubmitAuctionAssignLawyer(taskId, request);
            this.notificationService.openSnackbarSuccess(
              'ประกาศจากสำนักงานบังคับคดีจังหวัดสมุทรสาคร มอบหมายทนายความแล้ว'
            );
            this.routerService.back();
          }
          break;
        case taskCode.R2E09_06_7C:
          this.auctionService.collateralForm.markAllAsTouched();
          if (['PENDING', 'CORRECT_PENDING'].includes(this.statusCode)) {
            if (this.auctionService.collateralForm.valid) {
              const formData = this.auctionService.collateralForm.getRawValue();
              const prePayload = formData?.cashierCheque.find((it: any) => {
                return it.actionFlag;
              });
              if (
                this.validateBranchOpenDate(
                  this.auctionService.collateralForm.controls['cashierCheque'] as UntypedFormArray,
                  prePayload,
                  formData
                )
              )
                return;
              const payload: AuctionCashierCollateralRequest = {
                headerFlag: 'SUBMIT',
                assignedLawyerId: prePayload.assignedLawyerId || '',
                assignedLawyerMobileNo: prePayload.assignedLawyerMobileNo || '',
                branchCode: prePayload.branchCode || '',
                cashierCollateralId: Number(prePayload.cashierCollateralId),
                receiveCashierDate: prePayload.receiveCashierDate || '',
                receivedByLawyerId: prePayload.receivedByLawyerId || '',
                receivedByLawyerMobileNo: prePayload.receivedByLawyerMobileNo || '',
              };
              await this.auctionService.postAuctionCashierSubmit(payload);
              this.notificationService.openSnackbarSuccess(
                this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.PRESENTED')
              );
              this.routerService.navigateTo(`${MAIN_ROUTES.TASK}`);
            }
          } else {
            const auctionCollateralId = Number(this.taskService.taskDetail.objectId);
            const payload: AuctionCashierApprovalRequest = {
              headerFlag: 'APPROVE',
              taskId: this.taskService.taskDetail.id,
            };
            await this.auctionService.postAuctionCashierChequeApproval(auctionCollateralId, payload);
            if (this.statusCode === 'PENDING_APPROVAL') {
              this.notificationService.openSnackbarSuccess(
                this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.APPROVED')
              );
            } else {
              this.notificationService.openSnackbarSuccess(
                this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.PRESENTED')
              );
            }
            this.routerService.navigateTo(`${MAIN_ROUTES.TASK}`);
          }
          break;
        case taskCode.R2E09_06_12C:
          this.auctionService.stampDutyForm.markAllAsTouched();
          if (['PENDING', 'CORRECT_PENDING'].includes(this.statusCode)) {
            if (this.auctionService.stampDutyForm.valid) {
              const formData = this.auctionService.stampDutyForm.getRawValue();
              const prePayload = formData?.cashierCheque.find((it: any) => {
                return it.actionFlag;
              });
              if (
                this.validateBranchOpenDate(
                  this.auctionService.stampDutyForm.controls['cashierCheque'] as UntypedFormArray,
                  prePayload,
                  formData
                )
              )
                return;
              const payload: AuctionCashierStampDutySubmitRequest = {
                headerFlag: 'SUBMIT',
                cashierStampDutyId: prePayload.cashierStampDutyId || '',
                assignedLawyerId: prePayload.assignedLawyerId || '',
                assignedLawyerMobileNo: prePayload.assignedLawyerMobileNo || '',
                initBy: this.sessionService.currentUser?.userId,
                receivedByLawyerId: prePayload.receivedByLawyerId || '',
                receivedByLawyerMobileNo: prePayload.receivedByLawyerMobileNo || '',
                branchCode: prePayload.branchCode || '',
                receiveCashierDate: prePayload.receiveCashierDate || '',
              };
              await this.auctionService.postSubmitAuctionCashierChequeStampDuty(payload);
              this.notificationService.openSnackbarSuccess(
                this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.PRESENTED')
              );
              this.routerService.back();
            }
          } else {
            await this.approveStamptDuty();
          }
          break;
        case taskCode.R2E09_02_3B:
          await this.submitAuctionExpense();
          break;
        case taskCode.R2E09_14_3C:
          switch (this.auctionService.auctionExpenseInfo?.status) {
            case 'R2E09-14-3C_PENDING_SAVE':
            case 'R2E09-14-3C_PENDING_UPDATE':
              await this.submitAuctionExpenseNonEFiling('SUBMIT').then(response => {
                if (response) {
                  this.routerService.back();
                }
              });
              break;
            case 'R2E09-14-3C_PENDING_REVIEW':
            case 'R2E09-14-3C_PENDING_APPROVAL':
              try {
                const request: AuctionCashierExpenseApprovalRequest = {
                  headerFlag: 'APPROVE',
                  rejectReason: '',
                  taskId: this.taskService.taskDetail.id,
                };
                if (this.auctionService.auctionExpenseInfo?.status === 'R2E09-14-3C_PENDING_REVIEW') {
                  this.notificationService.openSnackbarSuccess('นำเสนอแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติมแล้ว');
                } else if (this.auctionService.auctionExpenseInfo?.status === 'R2E09-14-3C_PENDING_APPROVAL') {
                  this.notificationService.openSnackbarSuccess('อนุมัติแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติมแล้ว');
                }
                await this.auctionService.auctionCashierChequeExpenseApproval(auctionExpenseId, request);
                this.routerService.back();
                break;
              } catch (error) {
                console.error(error);
              }
          }
          break;
        case taskCode.R2E35_02_E09_01_7A:
          try {
            const formValid = this.auctionPaymentService.onTest;
            if (formValid.invalid) {
              formValid.markAsTouched();
              return;
            }
            const request: AuctionExpenseNonEFilingReceiptRequest = {
              receiptDocumentDto: this.documentDto ?? undefined,
            };
            await this.auctionPaymentService.submitReceiptAuctionExpenseNonEFilling(
              auctionExpenseId,
              this.taskService.taskDetail?.id || 0,
              request
            );
            this.notificationService.openSnackbarSuccess(
              'อัปโหลดใบเสร็จค่าใช้จ่ายเพิ่มเติม (แคชเชียร์เช็ค ) สำเร็จแล้ว'
            );
            this.routerService.back();
          } catch (err) {
            console.error(err);
          }
          break;
        case taskCode.R2E35_02_E09_02_7B:
          switch (this.auctionService.auctionExpenseInfo?.status) {
            case 'R2E35-02-E09-02-7B_PENDING_RECEIPT_UPDATE':
              try {
                const receiptDto = this.auctionPaymentService.auctionExpenseNonEFilingInvoice;
                console.log('receiptDto', receiptDto);
                const request: AuctionExpenseNonEFilingReceiptRequest = {
                  receiptDocumentDto: receiptDto.receiptDocumentDto,
                };
                await this.auctionPaymentService.submitReceiptAuctionExpenseNonEFilling(
                  auctionExpenseId,
                  this.taskService.taskDetail?.id || 0,
                  request
                );
                this.notificationService.openSnackbarSuccess(
                  'อัปโหลดใบเสร็จค่าใช้จ่ายเพิ่มเติม (แคชเชียร์เช็ค ) สำเร็จแล้ว'
                );
                this.routerService.back();
              } catch (err) {
                console.error(err);
              }
              break;
            case 'R2E35-02-E09-02-7B_PENDING_RECEIPT_VERIFICATION':
              try {
                const uploadNonEFilingRequest: PostApprovalRequest = {
                  action: 'APPROVE',
                };
                await this.auctionService.approveReceiptAuctionExpenseNonEFilling(
                  auctionExpenseId,
                  this.taskService.taskDetail?.id || 0,
                  uploadNonEFilingRequest
                );
                this.notificationService.openSnackbarSuccess('อนุมัติใบเสร็จค่าใช้จ่ายเพิ่มเติมแล้ว  รับทราบ');
                this.routerService.back();
              } catch (err) {
                console.error(err);
              }
              break;
          }

          break;
        case taskCode.R2E09_04_01_11:
          await this.submitAppointmentResult();
          break;
        case taskCode.R2E09_08_01_3_1:
          const taskId = Number(this.taskService.taskDetail.id);
          const conveyanceDocUploadId: number = Number(this.taskService.taskDetail.objectId);
          this.auctionService.seizureDocForm.markAllAsTouched();
          this.auctionService.seizureDocForm.updateValueAndValidity();
          if (this.auctionService.seizureDocForm.valid) {
            const req: ConveyanceUploadDocumentRequest = this.getConveyanceUploadDocumentRequest();
            const request: AuctionResultRecordingSubmitRequest = {
              headerFlag: 'SUBMIT',
              conveyanceDeedGroupDocuments: req.conveyanceDeedGroupDocuments,
              conveyanceOptionalUploadDocuments: req.conveyanceOptionalUploadDocuments,
            };
            (await this.auctionLedCardService.auctionResultRecordingSubmit(
              conveyanceDocUploadId,
              taskId,
              request
            )) as ConveyanceUploadDocumentResponse;
            this.notificationService.openSnackbarSuccess('เอกสารจากการซื้อทรัพย์อัปโหลดแล้ว');
            this.routerService.back();
          }

          break;
        case taskCode.R2E09_10_01:
          let debitBalance =
            typeof this.auctionService?.debitBalance === 'string'
              ? Utils.convertStringToNumber(this.auctionService?.debitBalance) || 0
              : this.auctionService?.debitBalance;
          if (
            (debitBalance === 0 ||
              this.auctionService?.debtTotal?.debtAmount === this.auctionService?.debtTotal?.settlementAmount) &&
            this.auctionService?.debtForm?.valid
          ) {
            this.submitAuctionDebtSettlement('SUBMIT');
          } else {
            this.notificationService.alertDialog(
              'ไม่สามารถนำเสนอรายการตัดบัญชีได้',
              `เนื่องจากคุณระบุค่าตัดบัญชีชำระหนี้ยังไม่ครบถ้วนทุกบัญชี
                <br/>
                แต่มีการระบุยอดตัดชำระหนี้คืนหน่วยงาน กรุณาระบุค่าตัดบัญชีชำระหนี้
                <br/>
                ให้ครบถ้วนทุกบัญชีก่อนคืนเงินให้หน่วยงาน`,
              'COMMON.BUTTON_ACKNOWLEDGE'
            );
          }
          break;
        case taskCode.R2E09_05_01_12A:
          if (this.isItemPaymentResult) {
            await this.submitExternalPaymentTrackingDeedGroup();
          } else {
            await this.submitExternalPaymentTrack();
          }
          break;
        case taskCode.R2E09_10_02:
          await this.auctionService.approvalAuctionDebtSettlementAccount({
            auctionDebtSettlementAccountId: this.auctionService?.debtForm?.get('auctionDebtSettlementAccountId')?.value,
            action: 'APPROVE',
          });
          this.notificationService.openSnackbarSuccess('อนุมัติรายการตัดบัญชีแล้ว');
          this.routerService.back();
          break;
        case taskCode.R2E09_10_03: {
          let debitBalance =
            typeof this.auctionService?.debitBalance === 'string'
              ? Utils.convertStringToNumber(this.auctionService?.debitBalance) || 0
              : this.auctionService?.debitBalance;
          if (
            (debitBalance === 0 ||
              this.auctionService?.debtTotal?.debtAmount === this.auctionService?.debtTotal?.settlementAmount) &&
            this.auctionService?.debtForm?.valid
          ) {
            this.submitAuctionDebtSettlement('SUBMIT');
          } else {
            this.notificationService.alertDialog(
              'ไม่สามารถนำเสนอรายการตัดบัญชีได้',
              `เนื่องจากคุณระบุค่าตัดบัญชีชำระหนี้ยังไม่ครบถ้วนทุกบัญชี
                <br/>
                แต่มีการระบุยอดตัดชำระหนี้คืนหน่วยงาน กรุณาระบุค่าตัดบัญชีชำระหนี้
                <br/>
                ให้ครบถ้วนทุกบัญชีก่อนคืนเงินให้หน่วยงาน`,
              'COMMON.BUTTON_ACKNOWLEDGE',
              'icon-Selected'
            );
          }
          break;
        }
        case taskCode.R2E09_06_03:
          if (this.statusCode === 'PENDING' || this.statusCode === 'CORRECT_PENDING') {
            try {
              const cashCourtForm = this.auctionService?.cashCourtForm.getRawValue();
              const prePayload = cashCourtForm?.cashierCheque?.find((it: any) => it.actionFlag === true);
              if (
                this.validateBranchOpenDate(
                  this.auctionService.cashCourtForm.controls['cashierCheque'] as UntypedFormArray,
                  prePayload,
                  cashCourtForm
                )
              )
                return;
              this.auctionService?.cashCourtForm?.markAllAsTouched();
              this.auctionService?.cashCourtForm?.updateValueAndValidity();
              if (this.auctionService?.cashCourtForm.valid) {
                const request: AuctionCashierAdditionalPaymentSubmitRequest =
                  this.getAuctionCashierAdditionalPaymentSubmitRequest('SUBMIT');
                await this.auctionService.submitAuctionCashierAdditionalPayment(request);
                this.notificationService.openSnackbarSuccess('นำเสนอแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
                this.routerService.back();
              }
            } catch (e) {}
          } else if (this.statusCode === 'PENDING_REVIEW' || this.statusCode === 'PENDING_APPROVAL') {
            try {
              const auctionCollateralId = Number(this.taskService.taskDetail.objectId);
              const payload: AuctionCashierAdditionApprovalRequest = {
                headerFlag: 'APPROVE',
                taskId: this.taskService.taskDetail.id,
              };
              await this.auctionService.auctionCashierChequeAdditionalApproval(auctionCollateralId, payload);
              if (this.statusCode === 'PENDING_REVIEW')
                this.notificationService.openSnackbarSuccess('นำเสนอแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
              this.routerService.back();
              if (this.statusCode === 'PENDING_APPROVAL')
                this.notificationService.openSnackbarSuccess('อนุมัติแคชเชียร์เช็ควางเงินเพิ่มแล้ว');
              this.routerService.back();
            } catch (e) {}
          }
          break;

        case taskCode.R2E09_09_01_13_1:
        case taskCode.R2E09_09_03_14_1:
          await this.callPostResultRecording();
          break;
      }
    }
  }

  private async callPostResultRecording() {
    switch (this.taskCode) {
      case taskCode.R2E09_09_03_14_1:
        const objectId = Number(this.taskService.taskDetail.objectId);
        const accountDocumentFollowUpTaskApprovalRequest: AccountDocumentFollowUpTaskApprovalRequest = {
          action: AccountDocumentFollowUpTaskApprovalRequest.ActionEnum.Approve,
          // approve?: boolean;
          // reason?: string;
          // _return?: boolean;
        };
        await this.auctionLedCardService.approveAccountDocumentFollowUpTask(
          objectId,
          this.taskId,
          accountDocumentFollowUpTaskApprovalRequest
        );

        await this.notificationService.openSnackbarSuccess('อนุมัติผลติดตามและตรวจรับรองบัญชีรับจ่ายแล้ว');
        this.auctionService.clearData();
        this.auctionService.accountDocFollowupForm?.reset();
        this.routerService.back();
        break;
      // case taskCode.R2E09_09_01_13_1:
      default:
        const accountDocFollowUpId = Number(this.taskService.taskDetail.objectId);
        const request: AccountDocumentResultRecordingRequest = this.formGroupToResultRecordingRequest(
          this.auctionService.accountDocFollowupForm
        );

        if (!request) return;

        let isConfirm = false;
        const isDraft = request.headerFlag === AccountDocumentResultRecordingRequest.HeaderFlagEnum.Draft;
        const isSubmit = [
          AccountDocumentResultRecordingRequest.HeaderFlagEnum.Submit1,
          AccountDocumentResultRecordingRequest.HeaderFlagEnum.Submit2,
        ].includes(request.headerFlag as AccountDocumentResultRecordingRequest.HeaderFlagEnum);

        if (isDraft) {
          isConfirm = await this.notificationService.warningDialog(
            'AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_DRAFT_TITLE',
            `AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_DRAFT_CONTENT`,
            'COMMON.BUTTON_CONFIRM_SAVE',
            'icon-save-primary'
          );
        } else if (isSubmit) {
          isConfirm = await this.notificationService.confirm(
            'AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_SUBMIT_TITLE',
            `AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_SUBMIT_CONTENT`,
            {
              rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
              buttonIconName: 'icon-save-primary',
              iconName: 'icon-Checkmark-Circle-Regular',
              iconClass: 'fill-black-100',
              leftButtonClass: 'box-shadow-none',
            }
          );
        }

        if (!isConfirm) return;

        if (!this.taskId && request.accountDocFollowup) {
          request.accountDocFollowup.aucRef =
            this.auctionService.accountDocumentsResponse?.publicAuctionAnnounce?.aucRef;
        }
        this.taskId
          ? await this.auctionLedCardService.postResultRecordingTasksSubmit(accountDocFollowUpId, this.taskId, request)
          : await this.auctionLedCardService.postResultRecording(request);

        const ROUND_TEXT = 'ครั้งที่ ' + (request.accountDocFollowup?.roundNo || '1');
        if (isDraft) {
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant(
              'AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_DRAFT_SAVED',
              { ROUND_TEXT }
            )
          );
        } else if (isSubmit) {
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant(
              'AUCTION_DETAIL.ACCOUNT_DOCUMENT.POPUP.CALL_POST_RESULT_RECORDING_CONFIRM_SUBMIT_SAVED',
              { ROUND_TEXT }
            )
          );
        }
        this.auctionService.clearData();
        this.auctionService.accountDocFollowupForm?.reset();
        this.routerService.back();
        break;
    }
  }

  private validateBranchOpenDate(_cashierCheque: UntypedFormArray, prePayload: any, formData: any) {
    const branchDetail = this.auctionService.branchList.ktbOrg?.find(it => it.value === prePayload.branchCode) as any;
    const _receiveCashierDate = prePayload.receiveCashierDate;
    const _lastOpedDate = branchDetail?.lastOpenDate || '';
    if (_lastOpedDate) {
      const dateReive = moment(_receiveCashierDate).startOf('day');
      const dateClose = moment(_lastOpedDate).startOf('day');
      if (dateReive.isSameOrAfter(dateClose)) {
        const formIndex = formData?.cashierCheque.findIndex((it: any) => it.actionFlag === true);
        const _targetForm = _cashierCheque.controls[formIndex] as UntypedFormGroup;
        _targetForm.get('receiveCashierDate')?.setErrors({ invalidDate: true });
        this.notificationService.alertDialog(
          'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.RECEIVE_DATE_INVALID',
          'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.RECEIVE_DATE_INVALID_DETAILS'
        );
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private validateBranchOpenDateFormControl(prePayload: any, targetForm: UntypedFormGroup): boolean {
    const { branchCode, receiveCashierDate } = prePayload;
    const branchDetail = this.getBranchDetailByCode(branchCode);
    const lastOpenDate = branchDetail?.lastOpenDate;

    if (!lastOpenDate) return false;

    const isDateInValid = this.isDateInValid(receiveCashierDate, lastOpenDate);

    if (isDateInValid) {
      this.setFormError(targetForm);
      this.showInvalidDateBanner();
      return true;
    }
    return false;
  }

  private getBranchDetailByCode(branchCode: string) {
    return this.auctionService.branchList.ktbOrg?.find(item => item.value === branchCode);
  }

  private isDateInValid(receiveDate: string, lastOpenDate: string): boolean {
    const dateReceive = moment(receiveDate).startOf('day');
    const dateClose = moment(lastOpenDate).startOf('day');
    return dateReceive.isSameOrAfter(dateClose);
  }

  private setFormError(targetForm: UntypedFormGroup) {
    targetForm.get('receiveCashierDate')?.setErrors({ invalidDate: true });
  }

  private showInvalidDateBanner() {
    this.notificationService.alertDialog(
      'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.RECEIVE_DATE_INVALID',
      'AUCTION_DETAIL.CASHIER_CHEQUE_COLLATERAL.RECEIVE_DATE_INVALID_DETAILS'
    );
  }

  private async approveStamptDuty() {
    const auctionCollateralId = Number(this.taskService.taskDetail.objectId);
    const payload: AuctionCashierApprovalRequest = {
      headerFlag: 'APPROVE',
      taskId: this.taskService.taskDetail.id,
    };
    await this.auctionService.postAuctionCashierChequeStampDutyApproval(auctionCollateralId, payload);
    if (this.statusCode === 'PENDING_APPROVAL') {
      this.notificationService.openSnackbarSuccess('อนุมัติแคชเชียร์เช็คอากรแสตมป์แล้ว');
    } else {
      this.notificationService.openSnackbarSuccess(
        this.translateService.instant('AUCTION_DETAIL.CASHIER_CHEQUE_STAMP_DUTY.PRESENTED')
      );
    }
    this.routerService.back();
  }

  private async approveAuctionLitigationCase() {
    try {
      const aucRef = Number(this.auctionService.selectAnouncementDetail?.aucRef);
      await this.auctionService.postSubmitAuctionLitigationCase(aucRef);
      this.notificationService.openSnackbarSuccess(this.translateService.instant('MATCHING_PROPERTY.VERIFIED_SUCCESS'));
      this.routerService.back();
    } catch (error) {
      this.auctionService.handleErrorForAuction(error);
    }
  }

  private async submitAuctionExpenseNonEFiling(headerFlag: AuctionExpenseRequest.HeaderFlagEnum) {
    try {
      const formData = this.auctionPaymentService.paymentNonEFilingFormGroup.getRawValue() as AuctionExpenseRequest;
      const dataInfo = await this.auctionService.getAuctionExpenseInfo(formData.auctionExpenseId || 0);
      formData.headerFlag = headerFlag;
      const request: AuctionExpenseRequest = this.createRequestNonEFilingFormData(formData);

      let documentRequire = '';
      if (formData.auctionExpenseType === 'SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE') {
        documentRequire = DOC_TEMPLATE.LEXSF133;
        const imageId = dataInfo.documents?.find(
          docId => docId.documentTemplate?.documentTemplateId === documentRequire
        );
        if (!request.auctionExpenseDoc?.uploadSessionId) {
          request.auctionExpenseDoc = {
            ...request.auctionExpenseDoc,
            uploadSessionId: imageId?.imageId,
          };
        }
        delete request.commandTimestamp;
        this.clearCommandTimestampValidator();
      } else if (formData.auctionExpenseType === 'WRIT_OF_EXECUTE_CASHIER_CHEQUE') {
        documentRequire = DOC_TEMPLATE.LEXSF134;
        const imageId = dataInfo.documents?.find(
          docId => docId.documentTemplate?.documentTemplateId === documentRequire
        );
        if (!request.auctionExpenseDoc?.uploadSessionId) {
          request.auctionExpenseDoc = {
            ...request.auctionExpenseDoc,
            uploadSessionId: imageId?.imageId,
          };
        }
        delete request.citationCaseAssignedDate;
        delete request.citationCaseCreatedDate;
        delete request.citationCaseNo;
        this.clearWritOfExecuteValidators();
      }

      if (headerFlag === 'SUBMIT') {
        if (this.auctionPaymentService.paymentNonEFilingFormGroup.invalid) {
          this.auctionPaymentService.paymentNonEFilingFormGroup.markAllAsTouched();
          return;
        }
      }

      let toast: string = '';
      const status = this.auctionService.auctionExpenseInfo?.status;
      if (formData.headerFlag === 'DRAFT') {
        toast = 'บันทึกคำขอค่าใช้จ่ายประกาศขายทอดตลาด';
      } else if (formData.headerFlag === 'SUBMIT') {
        toast = 'นำเสนอคำขอค่าใช้จ่ายประกาศขายทอดตลาดแล้ว';
      } else if (formData.headerFlag === 'APPROVE') {
        if (status === 'R2E09-14-3C_PENDING_APPROVAL') {
          toast = 'อนุมัติแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติมแล้ว';
        } else {
          toast = 'นำเสนอแคชเชียร์เช็คค่าใช้จ่ายเพิ่มเติมแล้ว';
        }
      }
      const response = await this.auctionService.postSubmitAuctionExpense(request);
      if (!response) return;
      this.identifyInvalidControls(this.auctionPaymentService.paymentNonEFilingFormGroup);
      this.handleSuccessfulResponseNonEFiling(response, toast);
      formData.auctionExpenseId = response.auctionExpenseId;
      await this.auctionService.getAuctionExpenseInfo(formData.auctionExpenseId || 0);
      return true;
    } catch (error) {
      console.error('Error during submitAuctionExpense', error);
      return;
    }
  }

  clearCommandTimestampValidator() {
    this.auctionPaymentService.paymentNonEFilingFormGroup.get('commandTimestamp')?.clearValidators();
    this.auctionPaymentService.paymentNonEFilingFormGroup.get('commandTimestamp')?.updateValueAndValidity();
  }

  clearWritOfExecuteValidators(): void {
    const formGroup = this.auctionPaymentService.paymentNonEFilingFormGroup;
    formGroup.get('citationCaseNo')?.clearValidators();
    formGroup.get('citationCaseNo')?.updateValueAndValidity();

    formGroup.get('citationCaseCreatedDate')?.clearValidators();
    formGroup.get('citationCaseCreatedDate')?.updateValueAndValidity();

    formGroup.get('citationCaseAssignedDate')?.clearValidators();
    formGroup.get('citationCaseAssignedDate')?.updateValueAndValidity();
  }

  // ! DO NOT DELETE THIS FUNCTION
  // * THIS FUNCTION USING FOR FIND THE INVALID CONTROLS
  // EXAMPLE YOU CAN USE CALL THIS FUNCTION AND SENT YOUR GROUP *identifyInvalidControls(yourFormGroup)*
  identifyInvalidControls(formGroup: UntypedFormGroup): void {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('Invalid controls:', invalid);
  }

  private async submitAuctionExpense() {
    try {
      const formData = this.auctionPaymentService.paymentOrderFormGroup.getRawValue() as AuctionExpenseRequest;
      const dataInfo = await this.auctionService.getAuctionExpenseInfo(formData.auctionExpenseId || 0);
      const request: AuctionExpenseRequest = this.createRequestFormData(formData);
      if (!formData.auctionExpenseDoc?.uploadSessionId) {
        delete request.auctionExpenseDoc;
      }
      let docRequire = '';
      if (formData.auctionExpenseType === 'SUMMON_FOR_SURCHARGE_E_FILING') {
        docRequire = DOC_TEMPLATE.LEXSF133;
        const imageIdSummon = dataInfo.documents?.find(
          docId => docId.documentTemplate?.documentTemplateId === docRequire
        );
        request.auctionExpenseDoc = {
          ...request.auctionExpenseDoc,
          uploadSessionId: imageIdSummon?.imageId || request.auctionExpenseDoc?.uploadSessionId,
        };
        delete request.commandTimestamp;
      } else if (formData.auctionExpenseType === 'WRIT_OF_EXECUTE_E_FILING') {
        docRequire = DOC_TEMPLATE.LEXSF134;
        const imageIdWrite = dataInfo.documents?.find(
          docId => docId.documentTemplate?.documentTemplateId === docRequire
        );
        request.auctionExpenseDoc = {
          ...request.auctionExpenseDoc,
          uploadSessionId: imageIdWrite?.imageId || request.auctionExpenseDoc?.uploadSessionId,
        };
        delete request.citationCaseAssignedDate;
        delete request.citationCaseCreatedDate;
        delete request.citationCaseNo;
      }

      let isFirstSubmit = true;

      if (formData.auctionExpenseId) {
        isFirstSubmit = false;
        const documents = dataInfo.documents || [];
        const hasRequireDocuments = documents
          .filter(templateId =>
            [docRequire, DOC_TEMPLATE.LEXSF135, DOC_TEMPLATE.LEXSF136].includes(
              templateId.documentTemplate?.documentTemplateId || ''
            )
          )
          .every(docId => docId.imageId);
        if (hasRequireDocuments) {
          this.notificationService
            .showCustomDialog({
              component: LegalExecutionWithdrawConfirmationDialogComponent,
              title: 'บันทึกข้อมูลครบถ้วนแล้ว',
              rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
              leftButtonLabel: 'COMMON.BUTTON_CANCEL',
              buttonIconName: 'icon-save-primary',
              iconName: 'icon-Checkmark-Circle-Regular',
              cancelEvent: true,
              context: {
                onCheck: 'onSubmitAuctionExpense',
              },
            })
            .then(async event => {
              if (!event.isCancel) {
                const response = await this.auctionService.postSubmitAuctionExpense(request);
                if (!response) return;
                this.handleSuccessfulResponse(response, 'บันทึกค่าใช้จ่าย E-Filing สำเร็จแล้ว').then(() =>
                  this.routerService.back()
                );
              }
            });
          return;
        } else {
          const dialogs = await this.onConfirmDialogEFiling();
          if (!dialogs) return;
        }
      } else {
        const dialogs = await this.onConfirmDialogEFiling();
        if (!dialogs) return;
      }
      const response = await this.auctionService.postSubmitAuctionExpense(request);
      if (!response) return;

      const toastMessage = isFirstSubmit ? 'บันทึกข้อมูลแล้ว' : 'บันทึกค่าใช้จ่าย e-Filing แล้ว';

      this.handleSuccessfulResponse(response, toastMessage);
      if (isFirstSubmit) {
        formData.auctionExpenseId = response.auctionExpenseId;
        isFirstSubmit = false;
      }
      await this.auctionService.getAuctionExpenseInfo(formData.auctionExpenseId || 0);
    } catch (error) {
      console.error('Error during submitAuctionExpense', error);
    }
  }

  async onConfirmDialogEFiling() {
    return await this.notificationService.warningDialog(
      'มีข้อมูลที่ยังบันทึกไม่ครบถ้วน',
      'กรุณากดปุ่ม "ยืนยันบันทึก" เพื่อบันทึกข้อมูลและออกจากหน้าจอนี้ และต้องกลับมาดำเนินการต่อภายหลัง หรือกดปุ่ม “ยกเลิก” เพื่อทำรายการต่อไป',
      'COMMON.BUTTON_CONFIRM_SAVE',
      'icon-Reset'
    );
    // const optionsDialog: DialogOptions = {
    //   rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
    //   leftButtonLabel: 'COMMON.BUTTON_CANCEL',
    //   rightButtonClass: 'primary',
    // };
    // const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
    //   'มีข้อมูลที่ยังบันทึกไม่ครบถ้วน',
    //   'กรุณากดปุ่ม "ยืนยันบันทึก" เพื่อบันทึกข้อมูลและออกจากหน้าจอนี้ และต้องกลับมาดำเนินการต่อภายหลัง หรือกดปุ่ม “ยกเลิก” เพื่อทำรายการต่อไป',
    //   optionsDialog
    // );
    // return res;
  }

  private createRequestFormData(formData: AuctionExpenseRequest): AuctionExpenseRequest {
    return {
      auctionExpenseType: formData.auctionExpenseType,
      citationCaseAssignedDate: formData.citationCaseAssignedDate,
      citationCaseCreatedDate: formData.citationCaseCreatedDate,
      citationCaseNo: formData.citationCaseNo,
      commandTimestamp: formData.commandTimestamp,
      ledId: formData.ledId,
      litigationCaseId: formData.litigationCaseId,
      litigationId: formData.litigationId,
      reason: formData.reason,
      auctionExpenseDoc: formData.auctionExpenseDoc,
      auctionExpenseId: this.auctionService?.auctionExpenseId
        ? Number(this.auctionService?.auctionExpenseId)
        : undefined,
    };
  }

  private createRequestNonEFilingFormData(formData: AuctionExpenseRequest): AuctionExpenseRequest {
    return {
      headerFlag: formData.headerFlag,
      auctionExpenseType: formData.auctionExpenseType,
      citationCaseAssignedDate: formData.citationCaseAssignedDate,
      citationCaseCreatedDate: formData.citationCaseCreatedDate,
      citationCaseNo: formData.citationCaseNo,
      commandTimestamp: formData.commandTimestamp,
      ledId: formData.ledId,
      litigationCaseId: formData.litigationCaseId,
      litigationId: formData.litigationId,
      reason: formData.reason,
      totalAmountPaid: formData.totalAmountPaid,
      auctionExpenseDoc: formData.auctionExpenseDoc,
      auctionExpenseId: this.auctionService?.auctionExpenseId
        ? Number(this.auctionService?.auctionExpenseId)
        : undefined,
      assignedLawyerMobileNo: formData.assignedLawyerMobileNo,
      receiveCashierDate: formData.receiveCashierDate,
      receivedByLawyerId: formData.receivedByLawyerId,
      receivedByLawyerMobileNo: formData.receivedByLawyerMobileNo,
      branchCode: formData.branchCode,
      payeeName: formData.payeeName,
    };
  }

  private async handleSuccessfulResponse(response: any, toast: string) {
    this.notificationService.openSnackbarSuccess(toast);
    this.auctionService.auctionExpenseId = response.auctionExpenseId;

    const currentAuctionExpenseId = this.auctionPaymentService.paymentOrderFormGroup?.get('auctionExpenseId')?.value;

    if (response.auctionExpenseId && !currentAuctionExpenseId) {
      this.auctionPaymentService.paymentOrderFormGroup.get('auctionExpenseId')?.setValue(response.auctionExpenseId);
      this.auctionPaymentService.isPaymentOrderFormTouched = false;
      this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentOrderFormGroup);
    } else {
      this.auctionPaymentService.isPaymentOrderFormTouched = false;
    }
  }

  private async handleSuccessfulResponseNonEFiling(response: any, toast: string) {
    this.notificationService.openSnackbarSuccess(toast);
    this.auctionService.auctionExpenseId = response.auctionExpenseId;

    const currentAuctionExpenseId =
      this.auctionPaymentService.paymentNonEFilingFormGroup?.get('auctionExpenseId')?.value;

    if (response.auctionExpenseId && !currentAuctionExpenseId) {
      this.auctionPaymentService.paymentNonEFilingFormGroup
        .get('auctionExpenseId')
        ?.setValue(response.auctionExpenseId);
      this.auctionPaymentService.isPaymentOrderFormTouched = false;
      this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentNonEFilingFormGroup);
    } else {
      this.auctionPaymentService.isPaymentOrderFormTouched = false;
    }
  }

  async onReject() {
    switch (this.taskCode) {
      case taskCode.R2E09_10_02:
        await this.auctionService.approvalAuctionDebtSettlementAccount({
          auctionDebtSettlementAccountId: this.auctionService?.debtForm?.get('auctionDebtSettlementAccountId')?.value,
          action: 'RETURN',
        });
        this.routerService.back();
        break;

      default:
        break;
    }
  }
  subButtonHandler(event: any) {
    switch (event.name) {
      case 'edit_annoucement':
        this.editAnnoucement();
        break;
      case 'reject_announcement':
        this.releaseAnnoucement();
        break;
      case 'approve':
        this.onSubmit();
        break;
      default:
        break;
    }
  }

  initActionBar() {
    if (
      (this.taskCode === taskCode.R2E09_00_1A || this.taskCode === taskCode.R2E09_00_01_1A) &&
      this.hasSubmitPermission &&
      this.isOwnerTask
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_COMPLETE',
      };
    } else if (this.taskCode === taskCode.R2E09_02_3B && this.hasSubmitPermission && this.isOwnerTask) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_CONFIRM_SAVE',
      };
    } else if (
      this.taskCode === taskCode.R2E09_06_7C &&
      ['PENDING', 'CORRECT_PENDING'].includes(this.statusCode) &&
      this.isOwnerTask
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_PROPOSE',
        hasSave: true,
      };
    } else if (
      (this.taskCode === taskCode.R2E09_10_01 || this.taskCode === taskCode.R2E09_10_03) &&
      this.isOwnerTask &&
      this.sessionService.hasPermission(PCode.SUBMIT_DEBT_PAYMENT_REDUCTION)
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_PROPOSE',
        hasSave: false,
      };
    } else if (this.taskCode === taskCode.R2E09_06_7C && this.statusCode === 'PENDING_REVIEW' && this.isOwnerTask) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: this.messageBanner !== '',
        primaryText: 'COMMON.BUTTON_PROPOSE',
        hasEdit: true,
        editIcon: 'icon-Arrow-Revert',
        editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
      };
    } else if (
      (this.taskCode === taskCode.R2E09_06_7C && this.statusCode === 'PENDING_APPROVAL' && this.isOwnerTask) ||
      (this.taskCode === taskCode.R2E09_10_02 && this.isOwnerTask)
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: this.messageBanner !== '',
        primaryText: 'COMMON.BUTTON_APPROVE',
        hasEdit: true,
        editIcon: 'icon-Arrow-Revert',
        editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
      };
    } else if (this.taskCode === taskCode.R2E09_04_01_11 && this.hasSubmitPermission && this.isOwnerTask) {
      if (
        (this.auctionService.itemActionCode &&
          this.auctionService.itemActionCode !== 'UPDATE' &&
          !this.auctionService?.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument) ||
        this.auctionService.submitResultStatus === true
      ) {
        this.actionBar = { ...this.actionBar, hasPrimary: false };
      } else if (
        this.auctionService.itemActionCode &&
        this.auctionService.itemActionCode !== 'UPDATE' &&
        this.auctionService?.auctionBiddingDeedGroupResponse?.aucBiddingResult?.requireReturnDocument
      ) {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          primaryText: this.isAuctionSubmitResultLanding ? 'บันทึกผล' : 'ยืนยันบันทึก',
        };
      } else {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          primaryText: this.isAuctionSubmitResultLanding ? 'บันทึกผล' : 'ยืนยันบันทึก',
        };
      }
    } else if (
      [taskCode.R2E09_09_01_13_1, taskCode.R2E09_09_03_14_1].includes(this.taskCode) &&
      this.hasSubmitPermission &&
      this.isOwnerTask
    ) {
      const isApprove = taskCode.R2E09_09_03_14_1 === this.taskCode;
      if (
        [taskCode.R2E09_09_03_14_1].includes(this.taskCode) &&
        !this.sessionService.hasPermission(PCode.APPROVE_ACCOUNT_AUDIT_CERTIFICATION)
      ) {
        this.actionBar = {
          hasSave: false,
          hasPrimary: false,
          hasCancel: false,
          hasReject: false,
          hasEdit: false,
        };
      } else {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          primaryText: isApprove ? 'COMMON.BUTTON_APPROVE' : 'ยืนยันบันทึก',
          hasEdit: isApprove,
          editIcon: 'icon-Arrow-Revert',
          editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
        };
      }
    } else if (
      this.taskCode === taskCode.R2E09_06_12C &&
      ['PENDING', 'CORRECT_PENDING'].includes(this.statusCode) &&
      this.hasSubmitPermission &&
      this.isOwnerTask
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryText: 'COMMON.BUTTON_PROPOSE',
        hasSave: true,
      };
    } else if (
      this.taskCode === taskCode.R2E09_06_12C &&
      this.statusCode === 'PENDING_REVIEW' &&
      this.hasSubmitPermission &&
      this.isOwnerTask
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: this.messageBanner !== '',
        primaryText: 'COMMON.BUTTON_PROPOSE',
        hasEdit: true,
        editIcon: 'icon-Arrow-Revert',
        editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
      };
    } else if (
      this.taskCode === taskCode.R2E09_06_12C &&
      this.statusCode === 'PENDING_APPROVAL' &&
      this.hasSubmitPermission &&
      this.isOwnerTask
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: this.messageBanner !== '',
        primaryText: 'COMMON.BUTTON_APPROVE',
        hasEdit: true,
        editIcon: 'icon-Arrow-Revert',
        editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
      };
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.hasSubmitPermission && this.isOwnerTask) {
      const isEditModeItem = this.auctionDetailItemPaymentResultService.mode === 'EDIT';
      const isEditModeMain = this.auctionService.mode === 'EDIT';
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: this.isItemPaymentResult ? isEditModeItem : isEditModeMain,
        primaryText: this.isItemPaymentResult ? 'บันทึกเสร็จสิ้น' : 'ยืนยันบันทึก',
      };
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
      this.auctionService.actionType === taskCode.ON_REQUEST &&
      this.auctionService.mode === 'EDIT'
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: true,
        primaryIcon: 'icon-Match',
        primaryText: 'จับคู่คดีความ',
        hasEdit: true,
        editIcon: 'icon-Dismiss-Circle',
        editText: 'ไม่ดำเนินการต่อ',
      };
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
      this.auctionService.actionType !== taskCode.ON_REQUEST &&
      this.auctionService.mode === 'EDIT'
    ) {
      this.actionBar = {
        ...this.actionBar,
        hasPrimary: false,
        hasEdit: true,
        editIcon: 'icon-Arrow-Revert',
        editText: 'ดำเนินการใหม่อีกครั้ง',
      };
    } else if (this.auctionService.actionCode === auctionActionCode.R2E09_4 && this.auctionService.mode === 'EDIT') {
      this.actionBar = {
        hasSave: false,
        hasPrimary: false,
        hasCancel: false,
        hasReject: false,
        hasEdit: false,
      };
      this.maxSubButton = 3;
      this.subButtonList = [
        {
          name: 'edit_annoucement',

          icon: 'icon-Note-Edit',
          text: 'MATCHING_PROPERTY.BTN_EDIT_ANNOUCEMENT',
          disabled: false,
        },
        {
          name: 'reject_announcement',

          icon: 'icon-Un-Match',
          text: 'MATCHING_PROPERTY.BTN_REJECT_ANNOUNCEMENT',
          disabled: false,
        },
        {
          name: 'approve',
          class: 'primary-button positive',
          icon: 'icon-Selected',
          text: 'เสร็จสิ้น',
          disabled: false,
        },
      ];
    } else if (
      this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')
    ) {
      switch (this.auctionService.actionCode) {
        case auctionActionCode.PENDING_NEW_ANNOUNCE:
          this.actionBar = {
            hasSave: true,
            saveText: 'บันทึก',
            hasPrimary: true,
            primaryText: 'ดำเนินการต่อ',
            primaryIcon: 'icon-Direction-Right',
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
            backText: 'กลับไปหน้าประกาศขายทอดตลาด',
          };
          break;
        case auctionActionCode.PENDING_NEW_DEEDGROUP:
          this.actionBar = {
            hasSave: true,
            saveText: 'บันทึก',
            hasPrimary: true,
            primaryText: 'ดำเนินการต่อ',
            primaryIcon: 'icon-Direction-Right',
            hasCancel: true,
            cancelText: 'กลับไปขั้นตอนก่อนหน้า',
            cancelButtonIcon: 'icon-Direction-Left',
            hasReject: false,
            hasEdit: false,
            backText: 'กลับไปหน้าประกาศขายทอดตลาด',
          };
          break;
        case auctionActionCode.PENDING_NEW_VALIDATE:
          this.actionBar = {
            hasSave: true,
            saveText: 'บันทึก',
            hasPrimary: true,
            primaryText: 'เสร็จสิ้น',
            primaryIcon: 'icon-Selected',
            hasCancel: true,
            cancelText: 'กลับไปขั้นตอนก่อนหน้า',
            cancelButtonIcon: 'icon-Direction-Left',
            hasReject: false,
            hasEdit: false,
            backText: 'กลับไปหน้าประกาศขายทอดตลาด',
          };
          break;
      }
    } else if (this.mode === 'ADD' && this.auctionService.auctionPaymentType) {
      const paymentType = this.auctionService.auctionPaymentType;
      const EFilingTypes = ['SUMMON_FOR_SURCHARGE_E_FILING', 'WRIT_OF_EXECUTE_E_FILING'];
      const NonEFilingTypes = ['SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE', 'WRIT_OF_EXECUTE_CASHIER_CHEQUE'];
      if (EFilingTypes.includes(paymentType)) {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_CONFIRM_SAVE',
        };
      } else if (NonEFilingTypes.includes(paymentType)) {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          hasSave: true,
          saveText: 'COMMON.BUTTON_SAVE',
          primaryText: 'COMMON.BUTTON_PROPOSE',
        };
      }
    } else if (this.taskCode === taskCode.R2E09_08_01_3_1 && this.isOwnerTask) {
      this.actionBar = {
        hasSave: true,
        primaryText: 'เสร็จสิ้น',
        saveText: 'บันทึก',
        primaryIcon: 'icon-Selected',
        hasPrimary: true,
        hasCancel: false,
        hasReject: false,
        hasEdit: false,
      };
    } else if (this.taskCode === taskCode.R2E09_06_03 && this.isOwnerTask) {
      switch (this.statusCode) {
        case 'PENDING':
        case 'CORRECT_PENDING':
          this.actionBar = {
            hasSave: true,
            primaryText: 'COMMON.BUTTON_PROPOSE',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
        case 'PENDING_REVIEW':
        case 'PENDING_APPROVAL':
          this.actionBar = {
            ...this.actionBar,
            primaryText: this.statusCode === 'PENDING_REVIEW' ? 'COMMON.BUTTON_PROPOSE' : 'COMMON.BUTTON_APPROVE',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasEdit: true,
            editIcon: 'icon-Arrow-Revert',
            editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          };
          break;
      }
    } else if (this.taskCode === taskCode.R2E09_14_3C && this.isOwnerTask) {
      switch (this.auctionService.auctionExpenseInfo?.status) {
        case 'R2E09-14-3C_PENDING_SAVE':
        case 'R2E09-14-3C_PENDING_UPDATE':
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            hasSave: true,
            saveText: 'COMMON.BUTTON_SAVE',
            primaryText: 'COMMON.BUTTON_PROPOSE',
          };
          break;
        case 'R2E09-14-3C_PENDING_REVIEW':
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            hasEdit: true,
            primaryText: 'COMMON.BUTTON_PROPOSE',
            editIcon: 'icon-Arrow-Revert',
            editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          };
          break;
        case 'R2E09-14-3C_PENDING_APPROVAL':
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            hasEdit: true,
            primaryText: 'COMMON.BUTTON_APPROVE',
            primaryIcon: 'icon-Selected',
            editIcon: 'icon-Arrow-Revert',
            editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          };
          break;
      }
    } else if (this.taskCode === taskCode.R2E35_02_E09_01_7A && this.isOwnerTask) {
      switch (this.auctionService.auctionExpenseInfo?.status) {
        case 'R2E35-02-E09-01-7A_PENDING_RECEIPT_UPLOAD':
        case 'R2E35-02-E09-02-7B_PENDING_RECEIPT_UPDATE':
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            primaryText: 'COMMON.BUTTON_COMPLETE',
            primaryIcon: 'icon-Selected',
          };
          break;
      }
    } else if (this.taskCode === taskCode.R2E35_02_E09_02_7B && this.isOwnerTask) {
      if (this.statusCode === 'AWAITING') {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          primaryText: 'COMMON.BUTTON_COMPLETE',
        };
      } else {
        this.actionBar = {
          ...this.actionBar,
          hasPrimary: true,
          hasEdit: true,
          primaryText: 'COMMON.BUTTON_APPROVE',
          editIcon: 'icon-Arrow-Revert',
          editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
        };
      }
    } else if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.CASHIER:
          this.actionBar = {
            hasSave: true,
            primaryText: 'COMMON.BUTTON_PROPOSE',
            saveText: 'บันทึก',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
        case AuctionMenu.UPLOAD_DOC:
          this.actionBar = {
            hasSave: false,
            primaryText: 'เสร็จสิ้น',
            saveText: 'บันทึก',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
        case AuctionMenu.REVOKE:
          this.actionBar = {
            hasSave: true,
            primaryText: 'COMMON.BUTTON_FINISH',
            saveText: 'บันทึก',
            primaryIcon: 'icon-Selected',
            hasPrimary: true,
            hasCancel: false,
            hasReject: false,
            hasEdit: false,
          };
          break;
        case AuctionMenu.ACCOUNT_DOCUMENT:
          this.actionBar = {
            ...this.actionBar,
            hasPrimary: true,
            primaryText: 'ยืนยันบันทึก',
            hasEdit: false,
            editIcon: 'icon-Arrow-Revert',
            editText: 'COMMON.BUTTON_SEND_BACK_EDIT',
          };
          break;
        default:
          break;
      }
    } else {
      this.actionBar = {
        hasSave: false,
        hasPrimary: false,
        hasCancel: false,
        hasReject: false,
        hasEdit: false,
      };
    }
  }

  initPermission() {
    if (this.mode === 'ADD') {
      this.hasSubmitPermission = true;
    } else if (this.mode === 'VIEW' && !this.isOwnerTask) {
      this.hasSubmitPermission = false;
    } else {
      this.hasSubmitPermission = this.sessionService.hasPermissionByTaskCode(this.taskCode);
    }
    this.auctionService.hasSubmitPermission = this.hasSubmitPermission;
  }

  initTaskScreenStatus() {
    if (this.taskCode === taskCode.R2E09_04_01_11 && !this.isAuctionSubmitResultLanding) {
      this.auctionDetailTitle = `ประกาศขายทอดตลาด${this.auctionService.auctionBidingInfoResponse?.ledName} ครั้งที่ ${this.auctionService.auctionBidingInfoResponse?.aucLedSeq}`;
      this.hasAdditionalTitle = true;
      this.additionalTitle = `วันขาย ${this.budismPipe.transform(
        this.auctionService.auctionBidingInfoResponse?.bidDate,
        'DD/MM/yyyy'
      )}`;
    } else if (this.taskCode === taskCode.R2E09_04_01_11 && this.isAuctionSubmitResultLanding) {
      this.auctionDetailTitle = `ชุดทรัพย์ที่ ${this.auctionService.auctionBidingInfoCollateralSelected?.fsubbidnum}`;
      this.hasAdditionalTitle = false;
    } else if (this.taskCode === taskCode.R2E09_00_1A || this.taskCode === taskCode.R2E09_00_01_1A) {
      this.auctionDetailTitle = this.auctionService?.taskLedName || '';
    } else if (
      this.taskCode === taskCode.R2E09_02_3B ||
      this.taskCode === taskCode.R2E09_14_3C ||
      this.taskCode === taskCode.R2E35_02_E09_01_7A ||
      this.taskCode === taskCode.R2E35_02_E09_02_7B ||
      this.auctionMenu === AuctionMenu.VIEW_PAYMENT
    ) {
      this.auctionDetailTitle = `วันที่บันทึก`;
      this.hasAdditionalTitle = true;
      this.additionalTitle = this.auctionService.auctionExpenseInfo?.createdTimestamp
        ? `${this.budismPipe.transform(this.auctionService.auctionExpenseInfo?.createdTimestamp, 'DD/MM/yyyy')}`
        : '-';
      this.auctionStatusCode =
        (this.auctionService.auctionExpenseInfo?.status as AuctionStatus) || ('' as AuctionStatus);
      this.auctionStatus = `TASK_CODE_STATUS.${this.auctionService.auctionExpenseInfo?.status}` || '';
      this.prefixAuctionStatus = 'PREFIX_AUCTION_STATUS.APPLICATION_FORM';
    } else if (
      this.auctionService.actionCode === auctionActionCode.R2E09_2_A ||
      this.auctionService.actionCode === auctionActionCode.R2E09_4
    ) {
      this.auctionDetailTitle = `ประกาศขายทอดตลาดสำนักงานบังคับคดี${this.auctionService.selectAnouncementDetail?.ledOriginalName}`;
      this.auctionStatusCode =
        (this.auctionService.selectAnouncementDetail?.aucStatus as AuctionStatus) || ('' as AuctionStatus);
      this.auctionMathchingStatus = this.auctionService.selectAnouncementDetail
        ?.matchingStatus as AuctionMathchingStatus;

      if([AuctionStatus.COMPLETE, AuctionStatus.NOT_PROCEED, AuctionStatus.ADJUST_SUBMIT].includes(this.auctionStatusCode)) {
        // change to 'aucStatusName' due to 'LEX2-44700'
        this.auctionStatus = this.auctionService.selectAnouncementDetail?.aucStatusName || '';
      } else {
        /* change to 'matchingStatusName' due to 'LEX2-44627' */
        this.auctionStatus = this.auctionService.selectAnouncementDetail?.matchingStatusName || '';
      }
    } else if (this.taskCode === taskCode.R2E05_561_A_MOCK) {
      this.auctionDetailTitle = 'สำนักงานบังคับคดีจังหวัดสมุทรสาคร';
      this.hasAdditionalTitle = true;
      this.additionalTitle = 'ครั้งที่ 1';
      this.auctionStatus = 'อยู่ระหว่างนัดตามประกาศขายทอดตลาด';
      this.auctionStatusCode = AuctionStatus.AUCTION;
      this.auctionMenu = AuctionMenu.VIEW_CASHIER;
    } else if (
      this.auctionMenu === AuctionMenu.VIEW_CASHIER ||
      this.auctionMenu === AuctionMenu.CASHIER ||
      [taskCode.R2E09_06_7C, taskCode.R2E09_06_12C, taskCode.R2E09_06_03].includes(this.taskCode)
    ) {
      const biddingAnnouceDetail = this.auctionService.auctionBiddingsAnnouncesResponse;
      this.auctionDetailTitle = `${biddingAnnouceDetail?.ledName}`;
      this.hasAdditionalTitle = true;
      this.additionalTitle = `ครั้งที่ ${biddingAnnouceDetail?.aucLedSeq}`;
      this.auctionStatus = `AUCTION_DETAIL.ANNOUNCE_BIDDING_STATUS.${biddingAnnouceDetail?.aucStatus}` || '';
      this.auctionStatusCode = biddingAnnouceDetail?.aucStatus as AuctionStatus;
    } else if (
      this.taskCode === taskCode.R2E09_10_01 ||
      this.taskCode === taskCode.R2E09_10_02 ||
      this.taskCode === taskCode.R2E09_10_03
    ) {
      const debtSettlement = this.auctionService.debtSettlement;
      this.auctionDetailTitle = debtSettlement?.ledName || '';
      this.additionalTitle = 'ครั้งที่ ' + debtSettlement?.aucLedSeq || '1';
      this.hasAdditionalTitle = true;
      this.auctionStatus = debtSettlement?.statusName || '';
      this.auctionStatusCode = (debtSettlement?.status as AuctionStatus) || AuctionStatus.AUCTION;
      this.prefixAuctionStatus = 'PREFIX_AUCTION_STATUS.DEFERRED_ACCOUNT';
    } else if ([taskCode.R2E09_09_01_13_1, taskCode.R2E09_09_03_14_1].includes(this.taskCode)) {
      this.auctionDetailTitle = this.auctionService?.accountDocumentsResponse?.publicAuctionAnnounce?.ledName || '';
      this.auctionStatus = 'ครบนัดตามประกาศขายทอดตลาด';
      this.hasAdditionalTitle = true;
      this.additionalTitle =
        'ครั้งที่ ' + this.auctionService?.accountDocumentsResponse?.publicAuctionAnnounce?.aucLedSeq || '1';
      this.auctionStatusCode = AuctionStatus.COMPLETE;
    } else if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.UPLOAD_DOC:
          this.auctionDetailTitle = this.auctionService?.conveyanceDocumentUploads.publicAuctionAnnounce?.ledName || '';
          this.auctionStatus = 'อยู่ระหว่างนัดตามประกาศขายทอดตลาด';
          this.hasAdditionalTitle = true;
          this.additionalTitle =
            'ครั้งที่ ' + this.auctionService?.conveyanceDocumentUploads.publicAuctionAnnounce?.aucLedSeq || '1';
          break;
        case AuctionMenu.ACCOUNT_DOCUMENT:
          this.auctionDetailTitle = this.auctionService?.accountDocumentsResponse?.publicAuctionAnnounce?.ledName || '';
          this.auctionStatus = 'ครบนัดตามประกาศขายทอดตลาด';
          this.hasAdditionalTitle = true;
          this.additionalTitle =
            'ครั้งที่ ' + this.auctionService?.accountDocumentsResponse?.publicAuctionAnnounce?.aucLedSeq || '1';
          this.auctionStatusCode = AuctionStatus.COMPLETE; // TODO: pallop re-check hardcode
          break;
        case AuctionMenu.VIEW_ACCOUNT:
          const debtSettlement = this.auctionService.debtSettlement;
          this.auctionDetailTitle = debtSettlement?.ledName || '';
          this.additionalTitle = 'ครั้งที่ ' + debtSettlement?.aucLedSeq || '1';
          this.hasAdditionalTitle = true;
          this.auctionStatus = debtSettlement?.statusName || '';
          this.auctionStatusCode = (debtSettlement?.status as AuctionStatus) || AuctionStatus.AUCTION;
          this.prefixAuctionStatus = 'PREFIX_AUCTION_STATUS.DEFERRED_ACCOUNT';
          break;
        default:
          break;
      }
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && !this.isItemPaymentResult) {
      this.auctionDetailTitle = `ประกาศขายทอดตลาด${this.auctionService.externalPaymentTrackingResponse?.ledName} ครั้งที่ ${this.auctionService.externalPaymentTrackingResponse?.aucLedSeq}`;
      this.hasAdditionalTitle = true;
      this.additionalTitle = `วันขาย ${this.budismPipe.transform(
        this.auctionService.externalPaymentTrackingResponse?.bidDate,
        'DD/MM/yyyy'
      )}`;
    } else if (this.taskCode === taskCode.R2E09_05_01_12A && this.isItemPaymentResult) {
      this.auctionDetailTitle = `ชุดทรัพย์ที่ ${this.auctionService.auctionBiddingDeedGroupResponse?.fsubbidnum}`;
      this.hasAdditionalTitle = false;
    } else if (this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '', true)) {
      this.auctionDetailTitle = `ประกาศขายทอดตลาด${this.auctionService.selectAnouncementDetail?.ledName || ''}`;
      this.auctionStatus = this.auctionService.selectAnouncementDetail?.matchingStatusName || '';
      this.auctionStatusCode = this.auctionService.selectAnouncementDetail?.aucStatus as AuctionStatus;
    }
    else {
      this.auctionDetailTitle = this.auctionService.selectAnouncementDetail?.ledName || '';
      this.auctionStatus = this.auctionService.selectAnouncementDetail?.aucStatusName || '';
    }
  }

  async cancelCollateralMatching() {
    const dialogRes = await this.notificationService.showCustomDialog({
      component: SubmitCancelMatchingDialogComponent,
      title: 'SUBMIT_CANCEL_MATCH_DIALOG.TITLE',
      iconName: 'icon-Error',
      rightButtonClass: 'long-button',
      buttonIconName: 'icon-Selected',
      rightButtonLabel: 'ยืนยัน',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      iconClass: 'fill-red',
      context: {
        isReProcess:
          this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
          this.auctionService.actionType !== taskCode.ON_REQUEST &&
          this.auctionService.mode === 'EDIT',
      },
    });
    if (dialogRes && dialogRes.isSuccess) {
      try {
        const aucRef = Number(this.auctionService.selectAnouncementDetail?.aucRef);
        const request: AuctionReasonRequest = {
          reason: dialogRes.reason,
        };
        if (
          this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
          this.auctionService.actionType === taskCode.ON_REQUEST &&
          this.auctionService.mode === 'EDIT'
        ) {
          try {
            await this.auctionService.postNotProcessReason(aucRef, request);
            this.routerService.back();
            this.notificationService.openSnackbarSuccess(
              this.translateService.instant('SUBMIT_CANCEL_MATCH_DIALOG.CHANGE_STATUS_NOT_PROCESS')
            );
          } catch (error) {
            this.auctionService.handleErrorForAuction(error);
          }
        } else if (
          this.auctionService.actionCode === auctionActionCode.R2E09_2_A &&
          this.auctionService.actionType !== taskCode.ON_REQUEST &&
          this.auctionService.mode === 'EDIT'
        ) {
          try {
            await this.auctionService.postReProcessReason(aucRef, request);
            this.routerService.back();
            this.notificationService.openSnackbarSuccess(
              this.translateService.instant('SUBMIT_CANCEL_MATCH_DIALOG.CHANGE_STATUS_PROCESS')
            );
          } catch (error) {
            this.auctionService.handleErrorForAuction(error);
          }
        }
      } catch (error) {
        const optionsDialog: DialogOptions = {
          rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE',
          leftButtonLabel: 'COMMON.BUTTON_CANCEL',
          buttonIconName: 'icon-Selected',
          rightButtonClass: 'primary',
          leftButtonClass: 'long-button',
        };

        const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
          'ทำรายการไม่สำเร็จ',
          'เนื่องจากมีผู้อื่นดำเนินการไปแล้ว โปรดเลือกรายการใหม่ ',
          optionsDialog
        );

        if (!res) return;
        try {
          this.routerService.back();
        } catch (error) {}
      }
    }
  }

  async editAnnoucement() {
    const response = await this.notificationService.showCustomDialog({
      component: SubmitEditAnnouncementDialogComponent,
      title: 'SUBMIT_EDIT_ANNOUNCEMENT_DIALOG.TITLE',
      iconClass: 'fill-red',
      iconName: 'icon-Error',
      rightButtonClass: 'long-button',
      buttonIconName: 'icon-Selected',
      rightButtonLabel: 'ยืนยัน',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      autoWidth: true,
      context: {
        aucRef: this.auctionService.selectAnouncementDetail?.aucRef,
      },
    });
    if (response && response.isSuccess) {
      this.notificationService.openSnackbarSuccess(
        this.translateService.instant('SUBMIT_EDIT_ANNOUNCEMENT_DIALOG.SUCCESS_MSG')
      );
      this.routerService.back();
    }
  }

  async releaseAnnoucement() {
    const response = await this.notificationService.showCustomDialog({
      component: SubmitReleaseAnnouncementDialogComponent,
      title: 'SUBMIT_RELEASE_ANNOUNCEMENT_DIALOG.TITLE',
      iconClass: 'fill-red',
      iconName: 'icon-Error',
      rightButtonClass: 'long-button',
      buttonIconName: 'icon-Selected',
      rightButtonLabel: 'ยืนยัน',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      leftButtonClass: '',
      cancelEvent: true,
      autoWidth: true,
      context: {
        aucRef: this.auctionService.selectAnouncementDetail?.aucRef,
      },
    });
    if (response && response.isSuccess) {
      this.notificationService.openSnackbarSuccess(
        this.translateService.instant('SUBMIT_RELEASE_ANNOUNCEMENT_DIALOG.CANCEL_UNMAP_SUCCESS')
      );
      this.routerService.back();
    }
  }

  private async submitAppointmentResult() {
    this.logger.info('AuctionComponent >> submitAppointmentResult', this.routerService.currentRoute);
    const currentRoute = this.routerService.currentRoute;
    if (currentRoute.indexOf('/auction/auction-detail') > -1) {
      // ****
      // [EXECUTION] บันทึกผลการขายของแต่ละชุดทรัพย์
      // ****
      this.auctionService.auctionSubmitResultPerCollateralForm.markAllAsTouched();
      if (this.auctionService.auctionSubmitResultPerCollateralForm.valid) {
        const auctionBiddingId = this.taskService.taskDetail.objectId || '';
        const deedGroupId = this.auctionService.auctionBidingInfoCollateralSelected?.deedGroupId || 0;
        const rawFormData = this.auctionService.auctionSubmitResultPerCollateralForm.getRawValue();
        this.logger.info(
          'AuctionComponent >> submitAppointmentResult >> elauctionService.auctionResultForm.valid',
          rawFormData
        );
        const requireReturnDocument = rawFormData.requireReturnDocument;
        const files = this.auctionService.auctionSubmitResultPerCollateralFiles?.getRawValue() || null;
        const returnFiles = this.auctionService.auctionSubmitResultPerCollateralReturnFiles?.getRawValue() || null;
        const resultDocument = files?.aucBiddingDeedGroupDocuments?.filter(
          (it: IUploadMultiFile) => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF139
        );
        const returnDocument = returnFiles?.aucBiddingDeedGroupDocuments?.filter(
          (it: IUploadMultiFile) => it.documentTemplate?.documentTemplateId === DOC_TEMPLATE.LEXSF140
        );
        if (
          requireReturnDocument &&
          (returnDocument?.filter((it: IUploadMultiFile) => it.imageId).length === 0 || !returnDocument)
        ) {
          const res = await this.displaySubmitResultDialogConfirm(
            'ยืนยันบันทึกผล',
            'กรุณากลับมาอัปโหลดเอกสารต่อในภายหลัง เพื่อเสร็จสิ้นงาน'
          );
          if (!res) return;
          await this.submitReturnDocumentPerCollateral(deedGroupId, auctionBiddingId, rawFormData);
          this.displaySubmitResultSuccessAndBack();
        } else if (requireReturnDocument && returnDocument?.filter((it: IUploadMultiFile) => it.imageId).length > 0) {
          const res = await this.displaySubmitResultDialogConfirm(
            'ยืนยันบันทึกผล',
            'หากต้องการแก้ไขมูลและเอกสาร สามารถทำได้ก่อนการเสร็จสิ้นงาน'
          );
          if (!res) return;
          await this.submitReturnDocumentPerCollateral(deedGroupId, auctionBiddingId, rawFormData);
          this.displaySubmitResultSuccessAndBack();
        } else if (
          resultDocument?.filter((it: IUploadMultiFile) => it.imageId).length === 0 &&
          rawFormData.aucResult === AuctionResultSubmitStatus.SOLD
        ) {
          const res = await this.displaySubmitResultDialogConfirm(
            'ยืนยันบันทึกผล',
            '<ul><li>กรุณาตรวจสอบความถูกต้องก่อนกดปุ่ม “ยืนยัน” เนื่องจากจะไม่สามารถแก้ไขผลการขายทอดตลาดได้</li><li>กรุณากลับมาอัปโหลดเอกสารต่อในภายหลัง เพื่อเสร็จสิ้นงาน</li></ul>'
          );
          if (!res) return;
          await this.submitResultPerCollateral(rawFormData, auctionBiddingId);
          this.displaySubmitResultSuccessAndBack();
        } else if (
          rawFormData.aucResult === AuctionResultSubmitStatus.SOLD &&
          resultDocument?.filter((it: IUploadMultiFile) => it.imageId).length > 0
        ) {
          const res = await this.displaySubmitResultDialogConfirm(
            'ยืนยันบันทึกผล',
            'หลังจากกดปุ่ม “ยืนยัน” จะไม่สามารถแก้ไข ผลการขายทอดตลาดได้<br>สามารถแก้ไขเอกสาร ก่อนการเสร็จสิ้นงาน'
          );
          if (!res) return;
          const response = await this.submitResultPerCollateral(rawFormData, auctionBiddingId);
          this.displaySubmitResultSuccessAndBack();
        } else {
          const res = await this.displaySubmitResultDialogConfirm(
            'ยืนยันบันทึกผล',
            'หลังจากกดปุ่ม “ยืนยัน” จะไม่สามารถแก้ไข ผลการขายทอดตลาดได้'
          );
          if (!res) return;
          await this.submitResultPerCollateral(rawFormData, auctionBiddingId);
          this.displaySubmitResultSuccessAndBack();
        }
      }
    } else {
      // ****
      // // [EXECUTION] บันทึกผลการขายของแต่ละนัด
      // ****
      this.logger.info(
        'AuctionComponent >> submitAppointmentResult >> else',
        this.auctionService.auctionSubmitResultForm.getRawValue()
      );
      try {
        const processingFiles = this.auctionService?.auctionSubmitResultForm?.getRawValue();
        const collaterals = this.auctionService.auctionBidingInfoResponse?.aucBiddingDeedGroups;
        const taskId = Number(this.taskService.taskDetail.id);
        const auctionBiddingId = this.taskService.taskDetail.objectId || '';
        const request: AuctionBiddingResultRecordingTasksSubmitRequest = {
          headerFlag: 'SUBMIT',
          attendAuctionFlag: processingFiles?.attendAuctionFlag || false,
        };
        if (
          processingFiles?.aucBiddingDocuments
            ?.filter((it: IUploadMultiFile) => it.uploadRequired)
            .every((it: IUploadMultiFile) => it.imageId) &&
          collaterals?.every(it => ['VIEW', 'REUPLOAD'].includes(it.action || ''))
        ) {
          const optionsDialog: DialogOptions = {
            rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonClass: 'primary',
            iconName: 'icon-Checkmark-Circle-Regular',
            iconClass: 'fill-gray',
            buttonIconName: 'icon-save-primary',
          };
          const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
            'APPOINTMENT_RESULT.DIALOG.TITLE.RECORDS_COMPLETED',
            'APPOINTMENT_RESULT.DIALOG.DETAIL.RECORDS_COMPLETED',
            optionsDialog
          );
          if (!res) return;
          const response = await this.auctionService.postAuctionBiddingResultRecordingTasksSubmit(
            auctionBiddingId,
            taskId,
            request
          );
          if (!response) return;
          this.notificationService.openSnackbarSuccess(
            `ประกาศจาก${this.auctionService.auctionBidingInfoResponse?.ledName} บันทึก ผลการขายทอดตลาด แล้ว`
          );
          this.routerService.back();
        } else {
          const optionsDialog: DialogOptions = {
            rightButtonLabel: 'COMMON.BUTTON_CONFIRM_SAVE',
            leftButtonLabel: 'COMMON.BUTTON_CANCEL',
            rightButtonClass: 'primary',
            buttonIconName: 'icon-save-primary',
            iconName: 'icon-Error',
            iconClass: 'fill-red',
          };
          const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
            'APPOINTMENT_RESULT.DIALOG.TITLE.RECORDS_INCOMPLETE',
            'APPOINTMENT_RESULT.DIALOG.DETAIL.RECORDS_INCOMPLETE',
            optionsDialog
          );
          if (!res) return;
          const response = await this.auctionService.postAuctionBiddingResultRecordingTasksSubmit(
            auctionBiddingId,
            taskId,
            request
          );
          if (!response) return;
          this.notificationService.openSnackbarSuccess(
            this.translateService.instant('APPOINTMENT_RESULT.SUBMITTED_SUCCESSFULLY', {
              LEDNAME: this.auctionService.auctionBidingInfoResponse?.ledName,
            })
          );
          this.routerService.back();
        }
      } catch (error) {
        this.logger.info('AuctionComponent >> submitAppointmentResult >> else', error);
      }
    }
  }

  private displaySubmitResultSuccessAndBack() {
    this.notificationService.openSnackbarSuccess(
      `ชุดทรัพย์ที่ ${this.auctionService.auctionBidingInfoCollateralSelected?.fsubbidnum} บันทึกผลขายทอดตลาด แล้ว`
    );
    this.routerService.back();
  }

  private async displaySubmitResultDialogConfirm(title: string, msg: string, isWarning?: boolean) {
    const optionsDialog: DialogOptions = {
      rightButtonLabel: 'ยืนยัน',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      rightButtonClass: 'primary',
      iconName: 'icon-Error',
      buttonIconName: 'icon-save-primary',
    };
    const res = await this.notificationService.confirmRemoveLeftAlignedDialog(title, msg, optionsDialog);
    return res;
  }

  private async submitResultPerCollateral(rawFormData: any, auctionBiddingId: string) {
    const _bidDates = this.auctionService.auctionBiddingDeedGroupResponse?.bidDate || '';
    const payload: AuctionBiddingResultsRequest = {
      aucBiddingResults: [
        {
          aucResult: rawFormData.aucResult,
          buyerName: rawFormData.buyerName,
          buyerType: rawFormData.buyerType,
          cancelBidDates: rawFormData.aucResult === 'CANCEL' ? [_bidDates] : [],
          cancelReasonType: rawFormData.cancelReasonType,
          deedGroupId: this.auctionService.auctionBidingInfoCollateralSelected?.deedGroupId,
          remark: rawFormData.remark,
          soldPrice: rawFormData.soldPrice,
          unsoldObjectBuyer: rawFormData.unsoldObjectBuyer,
          unsoldObjectDissident: rawFormData.unsoldObjectDissident,
          unsoldObjectHighestBidder: rawFormData.unsoldObjectHighestBidder,
          unsoldObjectPrice: rawFormData.unsoldObjectPrice,
          unsoldReasonType: rawFormData.unsoldReasonType,
        },
      ],
    };
    this.auctionService.auctionSubmitResultPerCollateralForm.markAsUntouched();
    const response = await this.auctionService.postAuctionBiddingResult(auctionBiddingId, payload);
    const aucBiddingId = this.taskService.taskDetail?.objectId || '';
    const latestResult = await this.auctionService.getAuctionBidingInfo(aucBiddingId);
    this.auctionService.auctionBidingInfoResponse = latestResult || {};
    return response;
  }

  private async submitReturnDocumentPerCollateral(deedGroupId: number, auctionBiddingId: string, rawFormData: any) {
    const payload: AuctionBiddingDocumentRequest = {
      returnDocumentNo: rawFormData.returnDocumentNo,
      returnDocumentRemark: rawFormData.returnDocumentRemark,
    };
    const response = await this.auctionService.postInquiryBiddingByAucBiddingIdAndDeedGroupId(
      auctionBiddingId,
      deedGroupId,
      payload
    );
    this.auctionService.auctionSubmitResultPerCollateralForm.markAsUntouched();
    const aucBiddingId = this.taskService.taskDetail?.objectId || '';
    const latestResult = await this.auctionService.getAuctionBidingInfo(aucBiddingId);
    this.auctionService.auctionBidingInfoResponse = latestResult || {};
    this.auctionService.submitResultStatus = false;
    return response;
  }

  async canDeactivate() {
    if (this.auctionMenu) {
      switch (this.auctionMenu) {
        case AuctionMenu.ACCOUNT_DOCUMENT:
        case AuctionMenu.CASHIER:
          if (this.auctionService.cashCourtForm?.touched || this.auctionService.accountDocFollowupForm?.dirty) {
            const isExit = await this.sessionService.confirmExitWithoutSave();
            if (!isExit) return this.noDeactivate;

            this.auctionService.cashCourtForm?.reset();
            this.auctionService.accountDocFollowupForm?.reset();
            return true;
          }
          return true;
        case AuctionMenu.UPLOAD_DOC:
          if (this.routerService.nextUrl.indexOf('/document-detail') > -1 || !this.auctionService.conveyanceHasEdit) {
            return true;
          } else {
            if (await this.sessionService.confirmExitWithoutSave()) {
              return true;
            }

            return this.noDeactivate;
          }
        default:
          break;
      }
    } else if (this.taskCode) {
      switch (this.taskCode) {
        case taskCode.R2E09_08_01_3_1:
          if (this.auctionService.conveyanceHasEdit) {
            if (await this.sessionService.confirmExitWithoutSave()) {
              return true;
            }

            return this.noDeactivate;
          }
          return true;
        case taskCode.R2E09_10_01:
        case taskCode.R2E09_10_02:
        case taskCode.R2E09_10_03:
          if (this.auctionService?.debtForm?.dirty) {
            if (await this.sessionService.confirmExitWithoutSave()) {
              return true;
            }

            return this.noDeactivate;
          }
          return true;
      }
    }
    return true;
  }

  get noDeactivate(): boolean {
    if (
      /*!this.routerService.currentStack.includes(this.routerService.nextUrl)*/
      !!this.tempLatestUrl &&
      !this.routerService.currentStack.includes(this.tempLatestUrl)
    ) {
      // reverse url stack
      // this.routerService.currentStack.push(this.routerService.nextUrl);
      this.routerService.pushStack(this.tempLatestUrl); // TODO: pallop work-around temporary to fix bug LEX2-28841
    }
    return false;
  }

  getConveyanceUploadDocumentRequest() {
    const conveyanceUploadDocuments: ConveyanceUploadDocumentBody[] = [];
    const conveyanceOptionalUploadDocuments: DocumentTemplateAndUploadSessionId[] = [];
    const conveyanceDeedGroupDocuments: ConveyanceDeedGroupDocuments[] = [];
    const request: ConveyanceUploadDocumentRequest = {
      conveyanceUploadDocuments: [],
      conveyanceOptionalUploadDocuments: [],
      conveyanceDeedGroupDocuments: [],
    };
    const data = this.auctionService?.conveyanceDocumentUploads;
    data.conveyanceUploadDocuments?.forEach((f: any) => {
      const isRelated = this.auctionMenu
        ? this.auctionService.relatedDeedGroupIDs.some(s => f.relatedDeedGroupIDs.includes(s))
        : true;
      if (isRelated)
        conveyanceUploadDocuments.push({
          document: {
            documentTemplateId: f?.document?.documentTemplate?.documentTemplateId,
            uploadSessionId: f.document?.imageId,
          },
          relatedDeedGroupIDs: f.relatedDeedGroupIDs,
        });
    });
    data.conveyanceOptionalUploadDocuments?.forEach((f: any) => {
      if (!!!f.disabled) {
        conveyanceOptionalUploadDocuments.push({
          documentTemplateId: f?.documentTemplate?.documentTemplateId,
          uploadSessionId: f?.imageId,
        });
      }
    });
    let ignore = ['COLLATERAL_CONTRACT', 'COLLATERAL'];
    data.conveyanceDeedGroupDocuments?.forEach((f: ConveyanceDeedGroupDocument | any) => {
      let arr: DocumentTemplateAndUploadSessionId[] = [];
      const isRelatedGroup = this.auctionMenu ? this.auctionService.relatedDeedGroupIDs.includes(f.deedGroupId) : true;
      if (isRelatedGroup) {
        f?.conveyanceDeedGroupUploadDocuments?.forEach((ff: any) => {
          if (!ignore.includes(ff.documentTemplate.documentGroup)) {
            arr.push({
              documentTemplateId: ff?.documentTemplate?.documentTemplateId,
              uploadSessionId: ff.imageId,
            });
          }
        });
        conveyanceDeedGroupDocuments.push({
          deedGroupId: f.deedGroupId,
          conveyanceDeedGroupUploadDocuments: arr,
        });
      }
    });
    request.conveyanceUploadDocuments = conveyanceUploadDocuments || [];
    request.conveyanceOptionalUploadDocuments = conveyanceOptionalUploadDocuments || [];
    request.conveyanceDeedGroupDocuments = conveyanceDeedGroupDocuments || [];
    return request;
  }

  private async submitExternalPaymentTrack() {
    try {
      const externalPaymentTracking = this.auctionService.externalPaymentTrackingResponse;
      const notAll = externalPaymentTracking?.collateralGroups?.some((row: any) => !row.paymentTrackingResult);
      let title = 'APPOINTMENT_RESULT.DIALOG.TITLE.RECORDS_COMPLETED';
      let msg = 'APPOINTMENT_RESULT.DIALOG.DETAIL.RECORDS_COMPLETED';
      let optionsDialog: DialogOptions = {
        iconName: 'icon-Checkmark-Circle-Regular',
        iconClass: 'icon-xmedium',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        leftButtonClass: 'long-button',
        rightButtonLabel: 'ยืนยันบันทึก',
        rightButtonClass: 'primary',
        buttonIconName: 'icon-save-primary',
        autoFocus: false,
      };
      if (notAll) {
        title = 'มีข้อมูลที่ยังบันทึกไม่ครบถ้วน';
        msg =
          'กรุณากดปุ่ม "ยืนยันบันทึก" เพื่อบันทึกข้อมูลและออกจากหน้านี้ แล้วกลับมาดำเนินการต่อภายหลังหรือ กด “ยกเลิก” เพื่อทำรายการต่อ';
        optionsDialog.iconName = 'icon-Error';
        optionsDialog.iconClass = 'icon-xmedium fill-red';
      }
      const res = await this.notificationService.confirmRemoveLeftAlignedDialog(title, msg, optionsDialog);
      if (!res) return;
      if (externalPaymentTracking?.externalPaymentTrackingId && !notAll) {
        await this.auctionService.postExternalPaymentTrackingSubmit(externalPaymentTracking.externalPaymentTrackingId);
      }
      this.notificationService.openSnackbarSuccess(
        `ประกาศจาก${this.auctionService.externalPaymentTrackingResponse?.ledName} บันทึกผลการชำระเงินแล้ว`
      );
      this.routerService.back();
    } catch (error) {}
  }

  private async submitAuctionDebtSettlement(headerFlag: string) {
    try {
      const data = this.auctionService?.debtForm?.value as any;
      let chequeAmount: number | undefined = 0;
      if (typeof data?.chequeAmount === 'string') {
        chequeAmount = Utils.convertStringToNumber(data?.chequeAmount);
      } else {
        chequeAmount = data?.chequeAmount;
      }
      const request: AuctionDebtSettlementRequest = {
        headerFlag: headerFlag,
        auctionDebtSettlementAccountId: data?.auctionDebtSettlementAccountId || '',
        chequeAmount: this.auctionService.chequeAmount || chequeAmount,
        creditNoteRefNo: data?.creditNoteRefNo || '',
        creditNoteOrganizationId: data?.creditNoteOrganizationId || '',
        availableDebtSettlementAmount: this.auctionService.debitBalance, // banner yello
        debtSettlementTransactions: [],
      };
      const litigationsList = data?.litigationsList as AuctionDebtSettlementAccountTransactionExtend[];
      for (let index = 0; index < litigationsList?.length; index++) {
        const element = litigationsList[index];
        let debtSettlementTransaction: any = {
          litigationId: element?.litigationId,
          originalLitigationCaseId: element?.originalLitigationCaseId,
          isMainCase: element?.isMainCase,
          debtSettlementAccounts: [],
          litigationCaseId: element?.litigationCaseId,
        };
        const debtSettlementAccounts = element?.debtSettlementAccounts || [];
        for (let i = 0; i < debtSettlementAccounts?.length; i++) {
          const debt = debtSettlementAccounts[i];
          if (debt.forDetail) {
            const struturedDebtList = debt.struturedDebtList || [];
            for (let j = 0; j < struturedDebtList.length; j++) {
              const strDebt = struturedDebtList[j];
              const accountsList = (strDebt.debtAmountTotal === 0 ? strDebt.accList : strDebt.accountsList) || [];
              for (let k = 0; k < accountsList.length; k++) {
                let acc = accountsList[k];
                if (!acc.isLastest) {
                  let debtSettlementAmount = 0;
                  if (typeof acc?.debtSettlementAmount === 'string') {
                    debtSettlementAmount = (Utils.convertStringToNumber(acc?.debtSettlementAmount) as any) || 0;
                  } else if (!acc?.debtSettlementAmount) {
                    debtSettlementAmount = 0;
                  } else {
                    debtSettlementAmount = acc?.debtSettlementAmount;
                  }
                  acc.debtSettlementAmount = debtSettlementAmount;
                  acc.debtAmount = typeof acc?.debtAmount === 'string' ? Number(acc?.debtAmount) : acc?.debtAmount;
                  debtSettlementTransaction.debtSettlementAccounts.push({
                    ...acc,
                  });
                }
              }
            }
          }
        }
        request?.debtSettlementTransactions?.push(debtSettlementTransaction);
      }
      const msg = headerFlag === 'SUBMIT' ? 'นำเสนอรายการตัดบัญชีแล้ว' : 'บันทึกรายการตัดบัญชีแล้ว';
      await this.auctionService.submitAuctionDebtSettlement(request);
      this.notificationService.openSnackbarSuccess(msg);
      if (headerFlag === 'SUBMIT') {
        this.auctionService?.debtForm?.markAllAsTouched();
        this.auctionService?.debtForm.markAsPristine();
        this.auctionService?.debtForm?.updateValueAndValidity();
        this.routerService.back();
      }
    } catch (error) {
      this.notificationService.openSnackbarError(
        this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR')
      );
    }
  }

  async submitExternalPaymentTrackingDeedGroup() {
    try {
      this.auctionDetailItemPaymentResultService.collateralGroupForm.markAllAsTouched();
      if (this.auctionDetailItemPaymentResultService.collateralGroupForm.invalid) return;
      const extendDocList: Array<any> = this.auctionDetailItemPaymentResultService?.collateralGroupForm?.get(
        'extendInfos'
      )?.value as Array<any>;
      const paymentTrackingDocumentsList: Array<any> =
        this.auctionDetailItemPaymentResultService?.collateralGroupForm?.get('externalPaymentTrackingDocuments')
          ?.value as Array<any>;
      const extendDocSessionIdList =
        extendDocList && extendDocList.length > 0
          ? extendDocList?.map(m => {
              return { uploadSessionId: m.uploadSessionId };
            })
          : [];
      const paymentTrackingDocumentsSessionIdList =
        paymentTrackingDocumentsList && paymentTrackingDocumentsList.length > 0
          ? paymentTrackingDocumentsList
              ?.filter(it => it.imageId)
              .map(m => {
                return { uploadSessionId: m.imageId };
              })
          : [];
      const req: ExternalPaymentTrackingDeedGroupRequest = {
        extendExpiredTimestamp:
          extendDocList && extendDocList.length > 0
            ? extendDocList[extendDocList.length - 1]?.extendExpiredTimestamp
            : '',
        extendRecordTimestamp:
          extendDocList && extendDocList.length > 0
            ? extendDocList[extendDocList.length - 1]?.extendRecordTimestamp
            : '',
        notPayReason: this.auctionDetailItemPaymentResultService.collateralGroupForm.get('notPayReason')?.value,
        paymentCompleteTimestamp:
          this.auctionDetailItemPaymentResultService.collateralGroupForm.get('paymentCompleteTimestamp')?.value,
        paymentTrackingResult:
          this.auctionDetailItemPaymentResultService.collateralGroupForm.get('paymentTrackingResult')?.value,
        remark: this.auctionDetailItemPaymentResultService.collateralGroupForm.get('remark')?.value,
        externalPaymentTrackingDocuments: [...extendDocSessionIdList, ...paymentTrackingDocumentsSessionIdList],
      };
      let optionsDialog: DialogOptions = {
        iconName: 'icon-Error',
        iconClass: 'icon-xmedium fill-red',
        leftButtonLabel: 'COMMON.BUTTON_CANCEL',
        leftButtonClass: 'long-button',
        rightButtonLabel: 'COMMON.BUTTON_CONFIRM',
        buttonIconName: 'icon-save-primary',
        rightButtonClass: 'primary',
        autoFocus: false,
      };
      const res = await this.notificationService.confirmRemoveLeftAlignedDialog(
        'บันทึกเสร็จสิ้น',
        'กรุณาตรวจสอบความถูกต้อง หลังจากกดปุ่ม "ยืนยัน" ข้อมูลดังกล่าวจะไม่สามารถกลับมาแก้ไขได้',
        optionsDialog
      );
      if (!res) return;
      const externalPaymentTrackingDeedGroupId =
        this.auctionDetailItemPaymentResultService.collateralGroup.externalPaymentTrackingDeedGroupId || 0;
      await this.auctionDetailItemPaymentResultService.postExternalPaymentTrackingDeedGroup(
        externalPaymentTrackingDeedGroupId,
        req
      );
      if (this.taskService?.taskDetail?.objectId) {
        const exID = Number(this.taskService.taskDetail.objectId);
        this.auctionService.externalPaymentTrackingResponse =
          await this.auctionService.getExternalPaymentTracking(exID);
      }
      this.notificationService.openSnackbarSuccess(
        `ชุดทรัพย์ที่ ${this.auctionDetailItemPaymentResultService.collateralGroup.fsubbidnum} บันทึกผลการชำระเงินแล้ว`
      );
      this.routerService.back();
    } catch (error) {
      this.notificationService.openSnackbarError(
        this.translateService.instant('EXCEPTION_CONFIG.MESSAGE_COMMON_ERROR')
      );
    }
  }

  formGroupToResultRecordingRequest(noValidatorDataForm: UntypedFormGroup): AccountDocumentResultRecordingRequest {
    const dataForm = this.auctionService.generateAuctionFollowAccDocForm(noValidatorDataForm);
    const certifyAccountWarrantStatus = dataForm.get('certifyAccountWarrantStatus')?.value;
    const certifyAccountWarrantType = dataForm.get('certifyAccountWarrantType')?.value;
    const certifyAccountWarrantDate = dataForm.get('certifyAccountWarrantDate')?.value;
    const accountDocVerifyStatus = dataForm.get('accountDocVerifyStatus')?.value;
    const remark = dataForm.get('remark')?.value;
    const accountDocVerifyResult = dataForm.get('accountDocVerifyResult')?.value;
    const accountDocDeedGroups = dataForm.get('accountDocDeedGroups')?.value;
    const debtSettlementAmount = dataForm.get('debtSettlementAmount')?.value;
    const chequeNo = dataForm.get('chequeNo')?.value;
    const amount = dataForm.get('amount')?.value;
    const chequeDate = dataForm.get('chequeDate')?.value;
    const chequeBankCode = dataForm.get('chequeBankCode')?.value;
    const refNo = dataForm.get('refNo')?.value;
    const recipientDeptCode = dataForm.get('recipientDeptCode')?.value;
    const recipientDeptName = dataForm.get('recipientDeptName')?.value;
    const accountDocReceiveStatus = dataForm.get('accountDocReceiveStatus')?.value;
    const chequeBranch = dataForm.get('chequeBranch')?.value;
    const files: IUploadMultiFile[] = dataForm.get('files')?.value || [];

    const scenario: AccDocScenario.AccDocScenarioEnum | null =
      this.auctionService.getAuctionFollowAccDocScenario(dataForm);
    // dataForm.markAllAsTouched(); // FIX LEX2-27722 no-need triggering invalid fields

    let isFilesValid = false;
    if (scenario) {
      const specifiedDocuments = specifiedDocumentsDict[scenario];
      // const notSpecifiedDocuments = notSpecifiedDocumentsDict[scenario];

      const filesTemplates = files.map(file => file.documentTemplate?.documentTemplateId || '');
      isFilesValid =
        specifiedDocuments.length === 0 ||
        (!specifiedDocuments.some(specifiedDocument => !filesTemplates.includes(specifiedDocument)) &&
          !files.some(
            dto =>
              (specifiedDocuments as string[]).includes(dto.documentTemplate?.documentTemplateId || '') && !dto.imageId
          ));
    }
    // dataForm.get('isFilesValid')?.setValue(isFilesValid); // FIX LEX2-27722 no-need triggering invalid fields
    const documents: Document[] = files
      .filter(dto => !!dto.imageId)
      .map(dto => {
        return {
          ...dto,
          uploadSessionId: dto.imageId, // uploadSessionId = Input, imageId = Output(to show on screen)
        } as Document;
      });

    let accountDocumentResultRecordingRequest: AccountDocumentResultRecordingRequest = {};
    let accountDocFollowup: AccountDocFollowup = {};
    if (scenario === AccDocScenario.AccDocScenarioEnum.S1 && !!certifyAccountWarrantDate) {
      accountDocumentResultRecordingRequest.headerFlag = 'SUBMIT1';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        certifyAccountWarrantType,
        accountDocVerifyStatus,
        certifyAccountWarrantDate,
        remark,
      };
    } else if (scenario === AccDocScenario.AccDocScenarioEnum.S2 && !!certifyAccountWarrantDate && isFilesValid) {
      accountDocumentResultRecordingRequest.headerFlag = 'SUBMIT1';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        certifyAccountWarrantType,
        accountDocVerifyStatus,
        accountDocVerifyResult,
        certifyAccountWarrantDate,
        remark,
        documents,
      };
    } else if (scenario === AccDocScenario.AccDocScenarioEnum.S3 && isFilesValid) {
      accountDocumentResultRecordingRequest.headerFlag = 'SUBMIT2';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        remark,
        documents,
      };
    } else if (scenario === AccDocScenario.AccDocScenarioEnum.S4 && !!certifyAccountWarrantDate && isFilesValid) {
      accountDocumentResultRecordingRequest.headerFlag = 'SUBMIT2';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        certifyAccountWarrantType,
        certifyAccountWarrantDate,
        remark,
        documents,
      };
    } else if (
      ['S5_1', 'S5_2'].includes(scenario || '') &&
      !!certifyAccountWarrantDate &&
      !!accountDocDeedGroups &&
      accountDocDeedGroups?.length > 0 &&
      debtSettlementAmount !== null &&
      debtSettlementAmount !== undefined &&
      isFilesValid &&
      (Number(debtSettlementAmount) <= 0 || (!!chequeNo && !!amount && !!chequeDate && !!chequeBankCode && !!refNo))
    ) {
      accountDocumentResultRecordingRequest.headerFlag = 'SUBMIT2';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        certifyAccountWarrantType,
        accountDocVerifyStatus,
        accountDocVerifyResult,

        certifyAccountWarrantDate,
        accountDocDeedGroups,
        remark,
        debtSettlementAmount,
        documents,
      };

      if (Number(debtSettlementAmount || 0) > 0) {
        accountDocFollowup = {
          ...accountDocFollowup,
          cashierChequeInfo: {
            chequeNo,
            amount,
            chequeDate,
            chequeBankCode,
            chequeBranch,
          },
          creditNoteInfo: {
            refNo,
            recipientDeptCode,
            recipientDeptName,
          },
        };
      }
    } else {
      accountDocumentResultRecordingRequest.headerFlag = 'DRAFT';

      accountDocFollowup = {
        certifyAccountWarrantStatus,
        certifyAccountWarrantType,
        accountDocVerifyStatus,
        accountDocVerifyResult,
        certifyAccountWarrantDate,
        accountDocDeedGroups,
        remark,
        debtSettlementAmount,
        documents,
        cashierChequeInfo: {
          chequeNo,
          amount,
          chequeDate,
          chequeBankCode,
          chequeBranch,
        },
        creditNoteInfo: {
          refNo,
          recipientDeptCode,
          recipientDeptName,
        },
      };
      accountDocFollowup = Utils.filterNullUndefined(accountDocFollowup);
    }

    accountDocumentResultRecordingRequest = {
      ...accountDocumentResultRecordingRequest,
      accountDocFollowup: {
        roundNo: dataForm.get('roundNo')?.value,
        ...accountDocFollowup,
        accountDocReceiveStatus,
      },
    };
    return accountDocumentResultRecordingRequest;
  }

  getAuctionCashierAdditionalPaymentSubmitRequest(
    headerFlag: AuctionCashierAdditionalPaymentSubmitRequest.HeaderFlagEnum
  ) {
    const cashCourtForm = this.auctionService?.cashCourtForm.getRawValue();
    const prePayload = cashCourtForm?.cashierCheque?.find((it: any) => it.actionFlag === true);
    const request: AuctionCashierAdditionalPaymentSubmitRequest = {
      additionalPaymentCashierId: this.taskCode
        ? parseInt(this.taskService?.taskDetail?.objectId || '0')
        : this.additionalPaymentCashierId
          ? this.additionalPaymentCashierId
          : undefined,
      ledId:
        Number(this.auctionService.ledId) ||
        prePayload.ledId ||
        this.auctionService.auctionBiddingsAnnouncesResponse?.ledId,
      headerFlag: headerFlag,
      additionalPaymentDocs: prePayload?.additionalPaymentDocs,
      amount:
        typeof prePayload?.amount === 'string' ? Utils.convertStringToNumber(prePayload?.amount) : prePayload?.amount,
      assignedLawyerId: prePayload?.assignedLawyerId,
      assignedLawyerMobileNo: prePayload?.assignedLawyerMobileNo,
      aucRef: prePayload?.aucRef,
      branchCode: prePayload?.branchCode,
      reason: prePayload?.reason,
      receiveCashierDate: prePayload?.receiveCashierDate,
      receivedByLawyerId: prePayload?.receivedByLawyerId,
      receivedByLawyerMobileNo: prePayload?.receivedByLawyerMobileNo,
    };
    return request;
  }

  public isInNewAuctionActionEdit(actionCode: string, ignoreMode: boolean = false): boolean {
    if ([
      auctionActionCode.PENDING_NEW_ANNOUNCE,
      auctionActionCode.PENDING_NEW_DEEDGROUP,
      auctionActionCode.PENDING_NEW_VALIDATE,
    ].includes(actionCode as auctionActionCode) &&
    (this.auctionService.mode === 'EDIT' || ignoreMode)) {
      return true
    }
    return false
  }

  async cancel() {
    if (this.isInNewAuctionActionEdit(this.auctionService.actionCode ?? '')) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        switch (this.auctionService.actionCode) {
          case auctionActionCode.PENDING_NEW_DEEDGROUP:
            this.auctionService.actionCode = auctionActionCode.PENDING_NEW_ANNOUNCE;
            this.newAuctionService.manualSetMatchStatus(AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewAnnounce)
            break;
          case auctionActionCode.PENDING_NEW_VALIDATE:
            this.auctionService.actionCode = auctionActionCode.PENDING_NEW_DEEDGROUP;
            this.newAuctionService.manualSetMatchStatus(AuctionCreateAnnounceSubmitRequest.MatchStatusEnum.PendingNewDeedgroup)
            break;
          default:
            return;
        }
        // this.initActionBarStatus();
        this.initActionBar();
        this.mappingPageBanner();
      }
    }

    /*
    if (this.hasEditStp2) {
      if (await this.sessionService.confirmExitWithoutSave()) {
        this.setFirstStep();
      }
    } else {
      this.setFirstStep();
    }
    */
  }
}
