import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuctionLedCardService } from '@app/shared/components/common-tabs/auction-led-card/auction-led-card.service';
import { AuctionStatus } from '@app/shared/constant';
import { TMode, auctionActionCode, taskCode } from '@app/shared/models';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  AccountDocFollowup,
  CashierChequeAdditionalPaymentResponse,
  ConveyanceDocumentUploadResponse,
  LexsUserOption,
} from '@lexs/lexs-client';
import { LawsuitService } from '../lawsuit/lawsuit.service';
import { TaskService } from '../task/services/task.service';
import { UserService } from '../user/user.service';
import { AuctionPaymentService } from './auction-advance-payment/service/auction-payment.service';
import { ConveyanceDocumentUploadResponseExtend } from './auction.const';
import { AuctionMenu } from './auction.model';
import { AuctionService } from './auction.service';
import { SessionService } from '@app/shared/services/session.service';
import { AUCTION_EXPENSE_TYPE, VIEW_TYPE } from './auction-advance-payment/interface/auction-efiling.model';
import { NewAuctionService } from './auction-add/new-auction.service';

@Injectable({
  providedIn: 'root',
})
export class AuctionResolver {
  private taskCode!: taskCode;
  private taskId!: number | undefined;
  private objectId!: number | undefined;

  /**
   * litigationCaseId and litigationId of execution case info resolver
   *  task menu get from this.taskService.taskDetail
   *  itigation menu get from routing params
   */
  private litigationCaseId!: string;
  private litigationId!: string;
  private auctionPaymentType!: string;
  private auctionExpenseId!: number;
  private isOnRequest!: boolean;
  private cashierCheque!: CashierChequeAdditionalPaymentResponse[];
  private isInquiryUserOptionsV2 = [
    taskCode.R2E09_00_1A,
    taskCode.R2E09_00_01_1A,
    taskCode.R2E09_06_7C,
    taskCode.R2E09_06_12C,
    taskCode.R2E09_06_03,
    taskCode.R2E09_06_04_6,
    taskCode.R2E09_14_3C
  ];

  private controlledByActionCodes = [
    auctionActionCode.PENDING_NEW_ANNOUNCE,
    auctionActionCode.PENDING_NEW_DEEDGROUP,
    auctionActionCode.PENDING_NEW_VALIDATE,
  ]

  constructor(
    private litigationCaseService: LitigationCaseService,
    private logger: LoggerService,
    private taskService: TaskService,
    private lawsuitService: LawsuitService,
    private auctionService: AuctionService,
    private userService: UserService,
    private routerService: RouterService,
    private auctionPaymentService: AuctionPaymentService,
    private auctionLedCardService: AuctionLedCardService,
    private sessionService: SessionService,
    private newAuctionService: NewAuctionService,
  ) {}

  get isOwnerTask(): boolean {
    const _owner = this.taskService.taskOwner;
    if (_owner && this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)) {
      return true;
    } else {
      return false;
    }
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.logger.logResolverStart('AuctionResolver :: ActivatedRouteSnapshot ', route);
    this.taskCode = '' as taskCode;
    const mode: TMode = route.queryParams['mode'];
    if (!this.auctionService.actionCode) {
      this.auctionService.actionCode = route.queryParams['actionCode'] || '';
    }
    this.auctionService.mode = mode || '';
    this.auctionService.actionType = (route.queryParams['actionType'] as taskCode) || '';
    this.auctionService.auctionMenu = route.queryParams['auctionMenu'] as AuctionMenu;
    this.auctionPaymentType = route.queryParams['auctionPaymentType'];
    let litigationId = route.queryParams['litigationId'];
    let ledId = route.queryParams['ledId'];
    this.objectId = route.queryParams['objectId'] || this.taskService.taskDetail.objectId;

    this.litigationCaseId =
      this.taskService?.taskDetail?.litigationCaseId || route.queryParams['litigationCaseId'] || '';

    if (this.routerService.navigateFormTaskMenu || mode === 'EDIT') {
      this.auctionService.taskLedName = JSON.parse(this.taskService.taskDetail.attributes || '{}')?.ledName || '';
    }

    if(this.routerService.currentRoute.includes('/main/task')) {
      // Resolve For Auction CaseTypeCode related on statusName
      this.auctionService.auctionCaseTypeCode = this.taskService.taskDetail.statusName?.endsWith("(คดีแพ่งโจทก์นอก)") ? '0002' : ''
    } else {
      this.auctionService.auctionCaseTypeCode = route.queryParams['auctionCaseTypeCode'] || '';
    }

    this.isOnRequest = !!route.queryParams['isOnRequest'];
    this.auctionService.isAccDocFollowupOnRequest = this.isOnRequest;

    if (mode === 'EDIT' || this.isOwnerTask) {
      this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
      this.taskId = this.taskService.taskDetail.id;
      this.litigationId = this.taskService.taskDetail.litigationId || '';
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';

      this.userService.kLawyerUserOptions = this.isInquiryUserOptionsV2.includes(this.taskCode)
        ? await this.userService.inquiryUserOptionsAndRoleCodeV2('KLAW', ['LAW006'], ['KLAW_USER'])
        : [];

      const litigationIdParam = Number(this.litigationCaseId);
      if (litigationIdParam) {
        this.litigationCaseService.litigationCaseShortDetail =
          await this.litigationCaseService.getLitigationCaseShortDetail(litigationIdParam);
        if (this.taskCode === taskCode.R2E09_00_1A) {
          this.auctionService.lawyerForm = this.auctionService.getLawyerForm({
            legalExecutionLawyerId: '',
            legalExecutionLawyerFullName: '',
          });
        } else if(this.controlledByActionCodes.includes(this.auctionService.actionCode as auctionActionCode)) {
          switch (this.auctionService.actionCode) {
            case auctionActionCode.PENDING_NEW_ANNOUNCE:
            case auctionActionCode.PENDING_NEW_DEEDGROUP:
            case auctionActionCode.PENDING_NEW_VALIDATE:
              await this.newAuctionService.setNewAuctionServiceData();
              break;
            default:
              break;
          }
        } else {
          let matchLawyer: LexsUserOption | undefined;
          if (this.taskCode === taskCode.R2E09_00_01_1A) {
            matchLawyer = this.userService.kLawyerUserOptions.find(
              it => it.userId === this.litigationCaseService.litigationCaseShortDetail.auctionLawyerIdNonPledgeAssets
            );
          } else {
            matchLawyer = this.userService.kLawyerUserOptions.find(
              it => it.userId === this.litigationCaseService.litigationCaseShortDetail.publicAuctionLawyerId
            );
          }
          this.litigationCaseService.litigationCaseShortDetail = {
            ...this.litigationCaseService.litigationCaseShortDetail,
            legalExecutionLawyerFullName: matchLawyer?.name,
            legalExecutionLawyerId: matchLawyer?.userId,
          };
          this.auctionService.lawyerForm = this.auctionService.getLawyerForm({
            legalExecutionLawyerId: matchLawyer?.userId,
            legalExecutionLawyerFullName: matchLawyer?.name,
          });
        }
      }
      this.auctionService.branchList = await this.auctionService.getCashierChequeBranchList();
      await this.fetchDataByTaskCode(this.taskCode, route);
    } else if (mode === 'ADD') {
      this.auctionService.auctionPaymentType = this.auctionPaymentType;
      this.auctionService.litigationId = litigationId;
      this.auctionService.litigationCaseId = this.litigationCaseId;
      this.auctionService.ledId = ledId;
      this.litigationCaseService.litigationCaseShortDetail =
        await this.litigationCaseService.getLitigationCaseShortDetail(Number(this.litigationCaseId));
      this.auctionService.branchList = await this.auctionService.getCashierChequeBranchList();

      this.userService.kLawyerUserOptions = await this.userService.inquiryUserOptionsAndRoleCodeV2('KLAW', ['LAW006'], ['KLAW_USER'])

      if (
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_E_FILING ||
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_E_FILING
      ) {
        this.auctionPaymentService.paymentOrderFormGroup = this.auctionPaymentService.getPaymentDetailFormGroup(
          this.auctionPaymentType,
          litigationId
        );
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentOrderFormGroup);
      } else if (
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE ||
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_CASHIER_CHEQUE
      ) {
        this.auctionPaymentService.paymentNonEFilingFormGroup =
          this.auctionPaymentService.getPaymentDetailNonEFilingFormGroup(this.auctionPaymentType, litigationId);
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentNonEFilingFormGroup);
      }
    } else {
      this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
      this.taskId = this.taskService.taskDetail.id;
      const litigationIdParam = Number(this.litigationCaseId);
      if (litigationIdParam) {
        this.litigationCaseService.litigationCaseShortDetail =
          await this.litigationCaseService.getLitigationCaseShortDetail(litigationIdParam);
        this.auctionService.lawyerForm = this.auctionService.getLawyerForm({
          ...this.litigationCaseService.litigationCaseShortDetail,
          legalExecutionLawyerId:
            this.auctionService.currentLed?.publicAuctionLawyerId ||
            this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId,
          legalExecutionLawyerFullName:
            this.auctionService.currentLed?.lawyerName ||
            this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerFullName,
        });
      } else {
        this.litigationCaseService.litigationCaseShortDetail = {};
        this.auctionService.lawyerForm = this.auctionService.getLawyerForm({
          legalExecutionLawyerId:
            this.auctionService.currentLed?.publicAuctionLawyerId ||
            this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerId,
          legalExecutionLawyerFullName:
            this.auctionService.currentLed?.lawyerName ||
            this.litigationCaseService.litigationCaseShortDetail.legalExecutionLawyerFullName,
        });
      }
      this.auctionService.branchList = await this.auctionService.getCashierChequeBranchList();
      this.userService.kLawyerUserOptions = this.isInquiryUserOptionsV2.includes(this.taskCode)
        ? await this.userService.inquiryUserOptionsAndRoleCodeV2('KLAW', ['LAW006'], ['KLAW_USER'])
        : [];
      if (this.routerService.navigateFormTaskMenu) {
        this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
        this.taskId = this.taskService.taskDetail.id;
        this.litigationId = this.taskService.taskDetail.litigationId || '';
        this.litigationId = this.lawsuitService.currentLitigation.litigationId || '';
        await this.fetchDataByTaskCode(this.taskCode, route);
      } else {
        const requestMenu =
          route.queryParams['requestMenu'] || route.queryParams['auctionMenu'] || this.auctionService.auctionMenu;
        await this.fetchViewDataByActionMenu(requestMenu, route, mode);
      }
    }
    return true;
  }

  private async fetchViewDataByActionMenu(requestMenu: any, route: ActivatedRouteSnapshot, mode: TMode) {
    if (requestMenu === AuctionMenu.VIEW_PAYMENT) {
      this.auctionService.auctionMenu = requestMenu as AuctionMenu;
      this.auctionExpenseId = route.queryParams['auctionExpenseId'];
      const expenseId = !this.routerService.navigateFormTaskMenu
        ? this.auctionExpenseId
        : this.taskService.taskDetail.objectId;
      this.auctionService.mode = 'VIEW';
      const auctionExpenseId = Number(expenseId);
      const response = await this.auctionService.getAuctionExpenseInfo(auctionExpenseId);
      this.auctionService.auctionExpenseInfo = response;
      this.auctionService.auctionPaymentType = response?.auctionExpenseType || '';
      if (
        response.auctionExpenseType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_E_FILING ||
        response.auctionExpenseType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_E_FILING
      ) {
        this.auctionPaymentService.paymentOrderFormGroup = this.auctionPaymentService.getPaymentDetailFormGroupWithApi(
          response,
          this.taskService.taskDetail.litigationId
        );
      } else if (
        response.auctionExpenseType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE ||
        response.auctionExpenseType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_CASHIER_CHEQUE
      ) {
        this.auctionPaymentService.paymentNonEFilingFormGroup =
          this.auctionPaymentService.getPaymentDetailNonEFilingFormGroupWithApi(
            response,
            this.taskService.taskDetail.litigationId
          );
        const stateStatus = this.auctionPaymentService.paymentNonEFilingFormGroup.get('status')?.value;

        const FETCH_DATA_STATUSES = [
          VIEW_TYPE.UPLOAD_RECEIPT_REJECT_VIEW_ACCESS,
          VIEW_TYPE.UPLOAD_RECEIPT_PENDING_VIEW_ACCESS,
          VIEW_TYPE.UPLOAD_RECEIPT_VIEW_ACCESS,
          VIEW_TYPE.COMPLETE,
        ];
        if (FETCH_DATA_STATUSES.includes(stateStatus)) {
          await this.fetchUploadEFiling.call(this, auctionExpenseId);
        }
      }
      this.auctionService.litigationId = this.taskService.taskDetail.litigationId || this.litigationId || '';
      this.auctionService.litigationCaseId =
        this.taskService.taskDetail.litigationCaseId || this.litigationCaseId || '';
      this.auctionService.auctionExpenseId = expenseId || '';
    } else if (requestMenu === AuctionMenu.VIEW_CASHIER) {
      this.auctionService.auctionMenu = requestMenu as AuctionMenu;
      const litigationCaseId = route.queryParams['litigationCaseId'];
      const litigationId = route.queryParams['litigationId'];
      this.auctionService.aucRef = route.queryParams['aucRef'];
      this.auctionService.litigationId = litigationId;
      this.auctionService.litigationCaseId = litigationCaseId;
      this.auctionService.auctionBiddingsAnnouncesResponse = await this.auctionService.getAuctionBiddingAnnounceResult(
        this.auctionService.aucRef
      );
      this.auctionService.auctionBiddingCollateralsSummaryResponse =
        await this.auctionService.getAuctionBiddingCollateralsSummary(this.auctionService.aucRef);
      this.auctionService.aucStatus = this.auctionService.auctionBiddingsAnnouncesResponse?.aucStatus as AuctionStatus;
      await this.fetchDataAccountDocFollowup(this.auctionService.aucRef);
      await this.fetchDataAddtionalCashierCheque(
        this.taskCode ? parseInt(this.taskService.taskDetail.objectId || '0') : 0,
        this.auctionService.aucRef?.toString()
      );
      this.auctionService.cashCourtForm = this.auctionService.getCashierChequeForm(true, {
        cashierCheque: this.cashierCheque,
      });
      let data: ConveyanceDocumentUploadResponseExtend = await this.auctionLedCardService.getConveyanceDocumentUploads(
        this.auctionService.aucRef
      );
      this.auctionService.conveyanceDocumentUploads = {
        ...data,
        aucRef: this.auctionService?.aucRef?.toString(),
        type: '',
      };
    } else if (requestMenu === AuctionMenu.UPLOAD_DOC) {
      const aucRef = route.queryParams['aucRef'] || this.auctionService.aucRef;
      const completed = this.auctionService.conveyanceDocumentUploads?.type === 'completed';
      if (!completed) {
        let data: ConveyanceDocumentUploadResponseExtend =
          await this.auctionLedCardService.getConveyanceDocumentUploads(aucRef);
        this.auctionService.conveyanceDocumentUploads = { ...data, aucRef: aucRef, type: '' };
      }

      //รายละเอียดแคชเชียร์เช็คสั่งจ่ายวางหลักประกัน
      const collateral = await this.auctionService.getInquiryAuctionCashierChequeCollateralsInfo(aucRef);
      this.auctionService.auctionBiddingsAnnouncesResponse =
        await this.auctionService.getAuctionBiddingAnnounceResult(aucRef);
      this.auctionService.collateralForm = this.auctionService.getCashierChequeForm(false, {
        cashierCheque: collateral,
      });
      await this.fetchDataCash(aucRef);
    } else if (requestMenu === AuctionMenu.ACCOUNT_DOCUMENT) {
      const aucRef = route.queryParams['aucRef'];
      await this.accountDocumentCallLegacyData(aucRef);

      /* LEX2-18039 on-request + viewMode */
      await this.fetchDataAccountDocFollowup(aucRef);
    } else if (requestMenu === AuctionMenu.CASHIER) {
      await this.fetchDataAddtionalCashier(route);
    } else if (requestMenu === AuctionMenu.VIEW_ACCOUNT) {
      const auctionDebtSettlementAccountId = Number(route.queryParams['auctionDebtSettlementAccountId']);
      await this.fetchAuctionDebtSettlementAccount(auctionDebtSettlementAccountId);
    }
  }

  async fetchDataAddtionalCashier(route: ActivatedRouteSnapshot) {
    this.taskCode = this.taskService.taskDetail.taskCode as taskCode;
    let aucRef = route.queryParams['aucRef'];
    await this.fetchDataAddtionalCashierCheque(
      this.taskCode ? parseInt(this.taskService.taskDetail.objectId || '0') : 0,
      aucRef
    );
    if (this.taskCode === taskCode.R2E09_06_03) {
      aucRef = this.cashierCheque?.length > 0 ? this.cashierCheque[0]?.aucRef : 0;
    }
    this.auctionService.auctionBiddingsAnnouncesResponse =
      await this.auctionService.getAuctionBiddingAnnounceResult(aucRef);
    this.auctionService.cashCourtForm = this.auctionService.getCashierChequeForm(true, {
      cashierCheque: this.cashierCheque,
    });
    const collateral = await this.auctionService.getInquiryAuctionCashierChequeCollateralsInfo(aucRef);
    const stampDuty = await this.auctionService.getAuctionCashierStampDuty(aucRef);
    this.auctionService.stampDutyForm = this.auctionService.getCashierChequeForm(false, { cashierCheque: stampDuty });
    this.auctionService.collateralForm = this.auctionService.getCashierChequeForm(false, {
      cashierCheque: collateral,
    });
    this.auctionService.auctionBiddingCollateralsSummaryResponse =
      await this.auctionService.getAuctionBiddingCollateralsSummary(this.auctionService.aucRef || aucRef);
  }

  async fetchDataByTaskCode(task: taskCode, route: ActivatedRouteSnapshot) {
    this.logger.logResolverStart(`[fetchDataByTaskCode][${task}]`);
    if (task === taskCode.R2E09_04_01_11) {
      const aucBiddingId = this.taskService.taskDetail?.objectId || '';
      const response = await this.auctionService.getAuctionBidingInfo(aucBiddingId);
      this.auctionService.auctionBidingInfoResponse = response;
    } else if (task === taskCode.R2E09_02_3B || task === taskCode.R2E09_14_3C) {
      const expenseId = !this.routerService.navigateFormTaskMenu
        ? this.auctionExpenseId
        : this.taskService.taskDetail.objectId;
      const auctionExpenseId = Number(expenseId);
      const response = await this.auctionService.getAuctionExpenseInfo(auctionExpenseId);
      this.auctionService.auctionPaymentType = response?.auctionExpenseType || '';
      this.auctionService.auctionExpenseInfo = response;
      if (
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_E_FILING ||
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_E_FILING
      ) {
        this.auctionPaymentService.paymentOrderFormGroup = this.auctionPaymentService.getPaymentDetailFormGroupWithApi(
          response,
          this.taskService.taskDetail.litigationId
        );
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentOrderFormGroup);
      } else if (
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.SUMMON_FOR_SURCHARGE_CASHIER_CHEQUE ||
        this.auctionService.auctionPaymentType === AUCTION_EXPENSE_TYPE.WRIT_OF_EXECUTE_CASHIER_CHEQUE
      ) {
        this.auctionPaymentService.paymentNonEFilingFormGroup =
          this.auctionPaymentService.getPaymentDetailNonEFilingFormGroupWithApi(
            response,
            this.taskService.taskDetail.litigationId
          );
        this.auctionPaymentService.formGroupUpdated.next(this.auctionPaymentService.paymentNonEFilingFormGroup);
      }
      this.auctionService.litigationId = this.taskService.taskDetail.litigationId || this.litigationId || '';
      this.auctionService.litigationCaseId =
        this.taskService.taskDetail.litigationCaseId || this.litigationCaseId || '';
      this.auctionService.auctionExpenseId = expenseId || '';
    } else if (task === taskCode.R2E09_06_7C || task === taskCode.R2E09_06_12C || task === taskCode.R2E09_06_03) {
      const cashierCollateralId = Number(this.taskService.taskDetail.objectId);
      if (task === taskCode.R2E09_06_7C) {
        const collateral = await this.auctionService.getInquiryAuctionCashierChequeCollateralsInfo(
          undefined,
          cashierCollateralId,
          this.taskId
        );
        this.auctionService.collateralForm = this.auctionService.getCashierChequeForm(false, {
          cashierCheque: collateral,
        });
      }

      const tempAucRef = Number(JSON.parse(this.taskService.taskDetail.attributes || '{}')?.aucRef || 0);
      this.auctionService.auctionBiddingsAnnouncesResponse =
        await this.auctionService.getAuctionBiddingAnnounceResult(tempAucRef);
      this.auctionService.auctionBiddingCollateralsSummaryResponse =
        await this.auctionService.getAuctionBiddingCollateralsSummary(tempAucRef);
      if (task === taskCode.R2E09_06_12C) {
        const collateral = await this.auctionService.getInquiryAuctionCashierChequeCollateralsInfo(tempAucRef);
        this.auctionService.collateralForm = this.auctionService.getCashierChequeForm(false, {
          cashierCheque: collateral,
        });
        const stamp = await this.auctionService.getAuctionCashierStampDuty(
          undefined, // aucRef,
          cashierCollateralId,
          this.taskId
        );
        this.auctionService.stampDutyForm = this.auctionService.getCashierChequeForm(false, {
          cashierCheque: stamp,
        });
      }
      if (task === taskCode.R2E09_06_03) {
        await this.fetchDataAddtionalCashier(route);
      }
    }
    if (task === taskCode.R2E09_05_01_12A) {
      if (this.taskService?.taskDetail?.objectId) {
        const exID = Number(this.taskService.taskDetail.objectId);
        this.auctionService.externalPaymentTrackingResponse =
          await this.auctionService.getExternalPaymentTracking(exID);
      }
    } else if (task === taskCode.R2E09_08_01_3_1) {
      let data: ConveyanceDocumentUploadResponse = await this.auctionLedCardService.getDocumentUploads(
        Number(this.objectId)
      );
      this.auctionService.conveyanceDocumentUploads = data;
      this.auctionService.aucRef = data.publicAuctionAnnounce?.aucRef || 0;
      await this.fetchDataAccountDocFollowup(this.auctionService.aucRef);
    } else if (task === taskCode.R2E09_10_01 || task === taskCode.R2E09_10_02 || task === taskCode.R2E09_10_03) {
      let auctionDebtSettlementAccountId: number = Number(this.taskService?.taskDetail?.objectId);
      await this.fetchAuctionDebtSettlementAccount(auctionDebtSettlementAccountId);
    } else if ([taskCode.R2E09_09_01_13_1, taskCode.R2E09_09_03_14_1].includes(task)) {
      // LEX2-18039-18046
      const accountDocFollowUpId = Number(this.objectId);
      this.auctionService.accountDocumentsResponse =
        await this.auctionLedCardService.getAccountDocumentsByAccountDocFollowUpId(accountDocFollowUpId);
      const tempAucRef = this.auctionService.accountDocumentsResponse?.publicAuctionAnnounce?.aucRef || 0;
      this.auctionService.aucRef = tempAucRef;
      this.auctionService.auctionBiddingsAnnouncesResponse =
        await this.auctionService.getAuctionBiddingAnnounceResult(tempAucRef);
      this.auctionService.auctionBiddingCollateralsSummaryResponse =
        await this.auctionService.getAuctionBiddingCollateralsSummary(this.auctionService.aucRef);
      const completed = this.auctionService.conveyanceDocumentUploads?.type === 'completed';
      if (!completed) {
        let data: ConveyanceDocumentUploadResponseExtend =
          await this.auctionLedCardService.getConveyanceDocumentUploads(tempAucRef);
        this.auctionService.conveyanceDocumentUploads = { ...data, aucRef: tempAucRef.toString(), type: '' };
      }
      this.setAccountDocFollowupForm();
    } else if (taskCode.R2E35_02_E09_01_7A || taskCode.R2E35_02_E09_02_7B) {
      const response = this.auctionService.auctionExpenseInfo;
      this.auctionPaymentService.paymentNonEFilingFormGroup =
        this.auctionPaymentService.getPaymentDetailNonEFilingFormGroupWithApi(
          response,
          this.taskService.taskDetail.litigationId
        );
    }
  }
  // รายละเอียดแคชเชียร์เช็ควางเงินเพิ่มตามหมายศาล
  async fetchDataCash(aucRef: string | undefined) {
    const stamp = await this.auctionService.getAuctionCashierStampDuty(
      aucRef ? parseInt(aucRef) : undefined,
      1,
      this.taskId
    );
    this.auctionService.cashCourtForm = this.auctionService.getCashierChequeForm(true, { cashierCheque: stamp });
  }

  async fetchDataAddtionalCashierCheque(additionalPaymentCashierId: number | undefined, aucRef: string | undefined) {
    this.cashierCheque = await this.auctionService.getCashierChequeAdditionalPayment(
      additionalPaymentCashierId,
      aucRef ? parseInt(aucRef) : undefined
    );
  }

  async fetchAuctionDebtSettlementAccount(auctionDebtSettlementAccountId: number) {
    this.auctionService.debtSettlement =
      await this.auctionService.getAuctionDebtSettlementAccount(auctionDebtSettlementAccountId);
    this.auctionService.debtForm = await this.auctionService.getDebtForm(this.auctionService.debtSettlement);
  }

  private async fetchDataAccountDocFollowup(aucRef: number) {
    /* LEX2-18039 on-request + viewMode */
    this.auctionService.accountDocumentsResponse = await this.auctionLedCardService.getAccountDocumentsByAucRef(aucRef);
    const isNoActiveData = !(this.auctionService.accountDocumentsResponse?.accountDocFollowups || []).some(
      dto => dto.activeFlag === true
    );
    if (this.isOnRequest && isNoActiveData) {
      const accountDocFollowups = this.auctionService.accountDocumentsResponse?.accountDocFollowups || [];
      const lastIndex = accountDocFollowups.length - 1;
      const lastAccDocFollowup = lastIndex >= 0 ? accountDocFollowups[lastIndex] : undefined;

      if (lastAccDocFollowup) {
        const brandNewData = this.generateOnRequestAccDocFollowup(lastAccDocFollowup);
        accountDocFollowups.push(brandNewData);
      }
    }
    this.setAccountDocFollowupForm();
  }

  // for ACCOUNT_DOCUMENT only
  private async accountDocumentCallLegacyData(aucRef?: number) {
    /* legacy call api from all previous block */
    const tempAucRef = aucRef || this.auctionService.accountDocumentsResponse?.publicAuctionAnnounce?.aucRef || 0;
    this.auctionService.aucRef = tempAucRef;

    this.auctionService.auctionBiddingsAnnouncesResponse =
      await this.auctionService.getAuctionBiddingAnnounceResult(tempAucRef);

    const completed = this.auctionService.conveyanceDocumentUploads?.type === 'completed';
    if (!completed) {
      let data: ConveyanceDocumentUploadResponseExtend =
        await this.auctionLedCardService.getConveyanceDocumentUploads(tempAucRef);
      this.auctionService.conveyanceDocumentUploads = { ...data, aucRef: tempAucRef.toString(), type: '' };
    }

    this.auctionService.auctionBiddingCollateralsSummaryResponse =
      await this.auctionService.getAuctionBiddingCollateralsSummary(tempAucRef);
    /* end legacy call api from all previous block */
  }
  private generateOnRequestAccDocFollowup(accountDocFollowup: AccountDocFollowup) {
    // fix for LEX2-18039 -> generate newData from FE on-Request round > 1
    return {
      roundNo: Number(accountDocFollowup.roundNo || 0) + 1,
      activeFlag: true,
      followupStatus: 'กำลังดำเนินการ',
      certifyAccountWarrantStatus: AccountDocFollowup.CertifyAccountWarrantStatusEnum.Receive,
      accountDocReceiveStatus: AccountDocFollowup.AccountDocReceiveStatusEnum.Receive,
      initType: 'M',
      documents: accountDocFollowup.documents?.map(dto => {
        return {
          documentTemplate: dto.documentTemplate,
        };
      }),
    };
  }
  private setAccountDocFollowupForm() {
    const accountDocFollowup = (this.auctionService.accountDocumentsResponse?.accountDocFollowups || []).find(
      dto => dto.activeFlag === true
    );
    if (accountDocFollowup) {
      this.auctionService.accountDocFollowupForm =
        this.auctionService.generateAuctionFollowAccDocFormNoRequiredMode(accountDocFollowup);
    } else {
      this.auctionService.accountDocFollowupForm = this.auctionService.generateAuctionFollowAccDocFormNoRequiredMode(
        {}
      );
    }
  }
  // END for ACCOUNT_DOCUMENT only

  private async fetchUploadEFiling(auctionExpenseId: number) {
    const response = await this.auctionPaymentService.getUploadReceiptAuctionExpenseNonEFilling(auctionExpenseId);
    this.auctionPaymentService.auctionExpenseNonEFilingInvoice = response;
  }
}
