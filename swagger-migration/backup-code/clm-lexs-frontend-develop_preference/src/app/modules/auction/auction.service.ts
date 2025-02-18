import { Injectable, Injector } from '@angular/core';
import { FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ConveyanceStatus, ERROR_CODE } from '@app/shared/constant';
import { IUploadMultiFile } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { RouterService } from '@app/shared/services/router.service';
import {
  AccountDocFollowup,
  AccountDocumentsResponse,
  AdjustSubmitRequest,
  AucBiddingDeedGroup,
  AuctionAdditionalPaymentRequest,
  AuctionAdditionalPaymentResponse,
  AuctionBiddingCollateralsSummaryResponse,
  AuctionBiddingControllerService,
  AuctionBiddingDeedGroupResponse,
  AuctionBiddingDocumentRequest,
  AuctionBiddingDocumentResponse,
  AuctionBiddingResultRecordingTasksSubmitRequest,
  AuctionBiddingResultRecordingTasksSubmitResponse,
  AuctionBiddingResultResponse,
  AuctionBiddingResultsRequest,
  AuctionBiddingResultsResponse,
  AuctionBiddingsAnnouncesResponse,
  AuctionCashierAdditionApprovalRequest,
  AuctionCashierAdditionalPaymentSubmitRequest,
  AuctionCashierAdditionalPaymentSubmitResponse,
  AuctionCashierApprovalRequest,
  AuctionCashierChequeBranchListResponse,
  AuctionCashierChequeCollateralsInfoResponse,
  AuctionCashierCollateralRequest,
  AuctionCashierExpenseApprovalRequest,
  AuctionCashierStampDutyResponse,
  AuctionCashierStampDutySubmitRequest,
  AuctionCashierStampDutySubmitResponse,
  AuctionCashierTransferOnwershipSubmitResponse,
  AuctionCashierTransferOwnershipApprovalRequest,
  AuctionCashierTransferOwnershipSubmitRequest,
  AuctionCollateralMatchRequest,
  AuctionCollateralValidateRequest,
  AuctionControllerService,
  AuctionDebtSettlementAccountApprovalRequest,
  AuctionDebtSettlementAccountUpdateRequest,
  AuctionDebtSettlementControllerService,
  AuctionDebtSettlementRequest,
  AuctionDetailsDto,
  AuctionExpenseControllerService,
  AuctionExpenseInfo,
  AuctionExpenseRequest,
  AuctionLedsAnnouncesResponse,
  AuctionLexsCollateralResponse,
  AuctionLexsSeizuresResponse,
  AuctionLitigationCaseControllerService,
  AuctionMatchRequest,
  AuctionReasonRequest,
  AuctionResolutionHistoryResponse,
  AuctionResolutionLatestDto,
  CashierChequeAdditionalPaymentResponse,
  CashierChequeTransferOwnershipResponse,
  ChequeInfoItem,
  CollateralGroup,
  ConveyanceAnnouncesDocumentsResponse,
  ConveyanceControllerService,
  ConveyanceDocumentUploadResponse,
  ConveyanceMasTransferResponse,
  DebtSettlementAccountControllerService,
  DebtSettlementAccountResponse,
  DocumentDto,
  ExternalPaymentTrackingResponse,
  FinancialControllerService,
  InquiryAnnouncesResponse,
  InquiryBiddingCollateralResponse,
  InquiryDeedGroupResponse,
  LatestPublicAuctionBiddingResponse,
  LatestResolutionInfoResponse,
  LedInfoDto,
  LitigationCaseShortDto,
  MasAppointmentInfoResponse,
  NameValuePair,
  PostApprovalRequest,
  SubmitAuctionAssignLawyerRequest,
  TransferProperty,
  AuctionDeedInfoMatchRequest,
  LedInfoResponse,
} from '@lexs/lexs-client';
import { SimpleSelectOption } from '@spig/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { TaskDetailService } from '../task/services/task-detail.service';
import { TaskService } from '../task/services/task.service';
import { UserService } from '../user/user.service';
import { AuctionPaymentService } from './auction-advance-payment/service/auction-payment.service';
import { ConveyanceDocumentUploadResponseExtend, SubmitAuctionResultAction } from './auction.const';
import { AuctionMenu } from './auction.model';
import { LitigationCaseService } from '@app/shared/services/litigation-case.service';
import { SessionService } from '@app/shared/services/session.service';
import {
  AccDocScenario,
  AccountDocVerifyResult,
  AccountDocVerifyStatus,
  CertifyAccountWarrantStatus,
  CertifyAccountWarrantType,
} from './auction-follow-account-doc/auction-follow-account-doc.const';
import { Utils } from '@app/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  auctionPaymentType!: string | null;
  actionCode!: string;
  auctionExpenseId!: string | number;
  ledId!: string;
  actionType!: string;
  aucStatus!: string;
  aucRef!: number;
  taskLedName: string = '';
  mode!: string;
  hideContentHeader: boolean = false;
  itemActionCode!: SubmitAuctionResultAction;
  npaStatus!: string;
  conveyanceStatus!: ConveyanceStatus;
  fsubbidnum!: number;
  chequeAmount!: number;

  selectAnouncementDetail: InquiryAnnouncesResponse | undefined;
  auctionCollateralToVerify: any | undefined;

  auctionCollaterals: AuctionDetailsDto | undefined;
  auctionLexsSeizures: AuctionLexsSeizuresResponse | undefined;
  litigationId!: string | number;
  litigationCaseId!: string | number;
  // data for verify collateral screen
  auctionLexsCollateralResponse: AuctionLexsCollateralResponse | undefined;
  // มติ และประวัติ มติ
  auctionResolutionsLatest: AuctionResolutionLatestDto | undefined;
  auctionResolutionsHistory: AuctionResolutionHistoryResponse | undefined;
  // รายละเอียดทั่วไป
  auctionBiddingsAnnouncesResponse: AuctionBiddingsAnnouncesResponse | undefined;
  // รายละเอียดทรัพย์
  auctionBiddingCollateralsSummaryResponse: AuctionBiddingCollateralsSummaryResponse | undefined;
  // NPA ตอบกลับ
  auctionInquiryBiddingCollaterals: InquiryBiddingCollateralResponse | undefined;
  // ประวัติวันขายทอดตลาด
  auctionBiddingResultResponse: AuctionBiddingResultResponse | undefined;
  // รายละเอียดมติที่ประชุม
  latestResolutionInfoResponse: LatestResolutionInfoResponse | undefined;
  auctionBiddingDeedGroupResponse: AuctionBiddingDeedGroupResponse | undefined;
  //
  inquiryDeedGroupResponse: InquiryDeedGroupResponse | undefined;
  sourceCollaralId: string | undefined;
  //data for [LEX2-498] - บันทึกผลการขายของแต่ละชุดทรัพย์
  auctionResultCollateral: LatestResolutionInfoResponse | undefined;
  // data for [LEX2-518] - งานบันทึกผลการขายของแต่ละนัด
  auctionBidingInfoResponse: LatestPublicAuctionBiddingResponse | undefined;
  auctionBidingChequeInfoItem: ChequeInfoItem | undefined;
  auctionBidingInfoCollateralSelected: AucBiddingDeedGroup | undefined;
  auctionInfoResponse!: AuctionExpenseInfo;
  appointmentInfo!: MasAppointmentInfoResponse[];
  transferPropertyList: TransferProperty[] = [];
  transferOwershipList!: CashierChequeTransferOwnershipResponse[];
  transferOwershipForm!: UntypedFormGroup;
  conveyanceDocument!: any;
  debitBalance: number = 0;
  debtTotal: any = {
    debtAmount: 0,
    settlementAmount: 0,
  };
  public mainList!: number;
  public conveyanceHasEdit = false;
  public _conveyanceDocumentUploads!: ConveyanceDocumentUploadResponse;
  public _conveyanceDocumentUploadsTemp!: ConveyanceDocumentUploadResponse;
  get conveyanceDocumentUploads(): ConveyanceDocumentUploadResponseExtend {
    return this._conveyanceDocumentUploads;
  }
  public _seizureDocData: any;
  public _seizureDocDataTemp: any;
  get seizureDocData() {
    return this._seizureDocData;
  }
  set conveyanceDocumentUploads(val: ConveyanceDocumentUploadResponseExtend) {
    this._conveyanceDocumentUploads = val;
  }
  get conveyanceDocumentUploadsTemp() {
    return this._conveyanceDocumentUploadsTemp;
  }
  set conveyanceDocumentUploadsTemp(val: any) {
    this._conveyanceDocumentUploadsTemp = val;
  }
  // LEXS2-552
  selectedCollateralsForRevocation: any[] = [];

  // LEX2-18039, 18046
  accountDocumentsResponse: AccountDocumentsResponse | undefined;

  // navigation from litigation menu
  public _auctionMenu!: AuctionMenu | null;

  public auctionExpenseInfo: AuctionExpenseInfo | undefined;

  get auctionMenu() {
    return this._auctionMenu;
  }
  set auctionMenu(val: AuctionMenu | null) {
    this._auctionMenu = val;
  }
  private _debtSettlement!: DebtSettlementAccountResponse;
  get debtSettlement(): DebtSettlementAccountResponse {
    return this._debtSettlement;
  }

  set debtSettlement(value: DebtSettlementAccountResponse) {
    this._debtSettlement = value;
  }

  previousIndexCollateralDetail = 0;
  isReselectCollateral = false;

  branchList!: AuctionCashierChequeBranchListResponse;
  editCashierCheque: any = {};
  externalPaymentTracking = 0;
  public seizureDocForm!: UntypedFormGroup;
  public relatedDeedGroupIDs: number[] = [];

  currentLed: LedInfoDto | undefined;

  // custom for submit result upload file
  public submitResultStatus = false;
  public triggerUpdateActionBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  hasSubmitPermission = false;

  public externalPaymentTrackingLatest: CollateralGroup | undefined;

  constructor(
    private fb: UntypedFormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private taskDetail: TaskDetailService,
    private routerService: RouterService,
    private auctionControllerService: AuctionControllerService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private auctionBidControllerService: AuctionBiddingControllerService,
    private auctionLitigationCaseControllerService: AuctionLitigationCaseControllerService,
    private financialControllerService: FinancialControllerService,
    private injector: Injector,
    private debtSettlementAccountControllerService: DebtSettlementAccountControllerService,
    private auctionDebtSettlementControllerService: AuctionDebtSettlementControllerService,
    private userService: UserService,
    private litigationCaseService: LitigationCaseService,
    private conveyanceControllerService: ConveyanceControllerService,
    private sessionService: SessionService,
    private auctionExpenseControllerService: AuctionExpenseControllerService
  ) {}

  private _auctionCaseTypeCode: string = '';
  get auctionCaseTypeCode() : string {
    return this._auctionCaseTypeCode;
  }
  set auctionCaseTypeCode(value: string) {
    this._auctionCaseTypeCode = value;
  }

  get isOwnerTask(): boolean {
    const _owner = this.taskService.taskOwner;
    if (_owner && this.sessionService.isOwnerTask(_owner, this.taskService.taskDetail.enableTaskSupportRole)) {
      return true;
    } else {
      return false;
    }
  }

  public lawyerForm!: UntypedFormGroup;
  getLawyerForm(data?: LitigationCaseShortDto) {
    if (data) {
      return this.fb.group({
        legalExecutionLawyerId: [data?.legalExecutionLawyerId || '', Validators.required],
        legalExecutionLawyerFullName: [data?.legalExecutionLawyerFullName || ''],
      });
    } else {
      return this.fb.group({});
    }
  }

  public verifyCollateralForm!: UntypedFormGroup;
  getVerifyCollateralForm(data?: AuctionCollateralValidateRequest) {
    if (data) {
      return this.fb.group({
        result: [data?.validationResult || '', Validators.required],
        reason: [data?.validationNote || ''],
      });
    } else {
      return this.fb.group({
        result: ['', Validators.required],
        reason: [''],
      });
    }
  }

  public genaralDeatailForm!: UntypedFormGroup;
  getGenaralDeatailForm(data?: InquiryAnnouncesResponse) {
    if (data) {
      return this.fb.group({
        announceDate: data?.announceDate,
        announceDocument: [data?.announceDocument],
        aucLedSeq: data.aucLedSeq,
        aucLot: data.aucLot,
        aucRef: data.aucRef,
        aucSet: data.aucSet,
        aucStatus: data.aucStatus,
        aucStatusName: data.aucStatusName,
        auctionMatchingLogs: [data.auctionMatchingLogs],
        defendantName: data.defendantName,
        fbidnum: data.fbidnum,
        inputDate: data.inputDate,
        isExhibit: data.isExhibit,
        lawCourtId: data.lawCourtId,
        lawCourtName: data.lawCourtName,
        ledId: data.ledId,
        ledName: data.ledName,
        litigationCaseId: data.litigationCaseId,
        litigationId: data.litigationId,
        matchingStatus: data.matchingStatus,
        matchingStatusName: data.matchingStatusName,
        plaintiffName: data.plaintiffName,
        redCaseNo: data.redCaseNo,
        saleChannel: data.saleChannel,
        saleLocation1: data.saleLocation1,
        saleLocation2: data.saleLocation2,
        saleTime1: data.saleTime1,
        saleTime2: data.saleTime2,
        dataDateList: [data.bidDates],
      });
    } else {
      return this.fb.group({});
    }
  }

  public genaralForm!: UntypedFormGroup;
  public uploadAucBiddingDocuments = new FormControl('', Validators.required);
  getGenaralForm(data?: AuctionBiddingsAnnouncesResponse) {
    if (data) {
      return this.fb.group({
        announceDate: data?.announceDate,
        aucBiddingDocuments: [data?.aucBiddingDocuments],
        aucLedSeq: data?.aucLedSeq,
        aucLot: data?.aucLot,
        aucRef: data?.aucRef,
        aucSet: data?.aucSet,
        aucStatus: data?.aucStatus,
        defendantName: data?.defendantName,
        originalLitigationCaseId: data?.originalLitigationCaseId,
        fbidnum: data?.fbidnum,
        isExhibit: data?.isExhibit,
        ledId: data?.ledId,
        ledName: data?.ledName,
        litigationCaseId: data?.litigationCaseId,
        litigationId: data?.litigationId,
        plaintiffName: data?.plaintiffName,
        redCaseNo: data?.redCaseNo,
        saleChannel: data.saleChannel,
        saleLocation1: data.saleLocation1,
        saleLocation2: data.saleLocation2,
        saleTime1: data.saleTime1,
        saleTime2: data.saleTime2,
        lastBidDate: '',
        dataDateList: [data.bidDates],
      });
    } else {
      return this.fb.group({});
    }
  }

  public collateralForm!: UntypedFormGroup;
  public stampDutyForm!: UntypedFormGroup;
  public cashCourtForm!: UntypedFormGroup;
  getCashierChequeForm(
    isOnRequest: boolean = false,
    data?: {
      cashierCheque:
        | AuctionCashierStampDutyResponse[]
        | AuctionCashierChequeCollateralsInfoResponse[]
        | CashierChequeAdditionalPaymentResponse[];
    }
  ) {
    if (data) {
      let form = this.fb.group({
        cashierCheque: this.fb.array([]),
      });
      let cashierCtr = form.controls['cashierCheque'] as UntypedFormArray;
      let dataCashier = data.cashierCheque;
      if (data) {
        for (let i = 0; i < dataCashier?.length; i++) {
          const cashier = dataCashier[i];
          const amount = (cashier as CashierChequeAdditionalPaymentResponse).amount || '';
          let cashierForm = this.fb.group({
            cashierCollateralId: (cashier as AuctionCashierChequeCollateralsInfoResponse).cashierCollateralId || '-',
            cashierStampDutyId: (cashier as AuctionCashierStampDutyResponse).cashierStampDutyId || '-',
            actionFlag: cashier.actionFlag || false,
            amount: [
              Utils.numberWithCommas(amount) || (isOnRequest ? '' : '-'),
              isOnRequest && cashier.actionFlag ? Validators.required : null,
            ],
            aucRef: cashier.aucRef || '-',
            meetingNo: (cashier as AuctionCashierChequeCollateralsInfoResponse).meetingNo || '-',
            meetingDate: (cashier as AuctionCashierChequeCollateralsInfoResponse).meetingDate || '-',
            totalDeedGroup: (cashier as AuctionCashierChequeCollateralsInfoResponse).totalDeedGroup || '-',
            status:
              (cashier as AuctionCashierChequeCollateralsInfoResponse).status ||
              (cashier as CashierChequeAdditionalPaymentResponse).statusCode ||
              '-',
            rejectReason: cashier.rejectReason,
            ledId: cashier.ledId || isOnRequest ? '' : '-',
            ledName: cashier.ledName || 'สำนักงานบังคับคดี' + this.auctionBiddingsAnnouncesResponse?.ledName || '-',
            branchName: cashier.branchName || '',
            assignedLawyerId:
              cashier.assignedLawyerId || this.lawyerForm.controls['legalExecutionLawyerId'].value || '-',
            totalAmount: (cashier as AuctionCashierChequeCollateralsInfoResponse).totalAmount || '-',
            deedGroupId: (cashier as AuctionCashierStampDutyResponse).deedGroupId || '-',
            feeAmount: (cashier as AuctionCashierStampDutyResponse).feeAmount || '-',
            soldDate: (cashier as AuctionCashierStampDutyResponse).soldDate || '-',
            soldPrice: (cashier as AuctionCashierStampDutyResponse).soldPrice || '-',
            deedGroupRecordList: this.fb.array([]),
            orderList: this.fb.array([]),
            orderNo: (cashier as CashierChequeAdditionalPaymentResponse)?.orderNo || '',
          });

          if (cashier.actionFlag) {
            cashierForm.addControl(
              'assignedLawyerMobileNo',
              new UntypedFormControl(cashier.assignedLawyerMobileNo, Validators.required)
            );
            cashierForm.addControl(
              'receivedByLawyerId',
              new UntypedFormControl(cashier.receivedByLawyerId, Validators.required)
            );
            cashierForm.addControl(
              'receivedByLawyerMobileNo',
              new UntypedFormControl(cashier.receivedByLawyerMobileNo, Validators.required)
            );
            cashierForm.addControl(
              'branchCode',
              new UntypedFormControl(
                (cashier as AuctionCashierChequeCollateralsInfoResponse).branchCode,
                Validators.required
              )
            );
            cashierForm.addControl(
              'receiveCashierDate',
              new UntypedFormControl(
                (cashier as AuctionCashierChequeCollateralsInfoResponse).receiveCashierDate,
                Validators.required
              )
            );
          } else {
            cashierForm.addControl(
              'assignedLawyerMobileNo',
              new UntypedFormControl(cashier.assignedLawyerMobileNo || '')
            );
            cashierForm.addControl('receivedByLawyerId', new UntypedFormControl(cashier.receivedByLawyerId || ''));
            cashierForm.addControl(
              'receivedByLawyerMobileNo',
              new UntypedFormControl(cashier.receivedByLawyerMobileNo || '')
            );
            cashierForm.addControl(
              'branchCode',
              new UntypedFormControl((cashier as AuctionCashierChequeCollateralsInfoResponse).branchCode || '')
            );
            cashierForm.addControl(
              'receiveCashierDate',
              new UntypedFormControl((cashier as AuctionCashierChequeCollateralsInfoResponse).receiveCashierDate || '')
            );
          }

          if (isOnRequest) {
            cashierForm.addControl(
              'reason',
              new UntypedFormControl((cashier as CashierChequeAdditionalPaymentResponse).reason)
            );

            let cashierAdditionalPaymentDocs =
              ((cashier as CashierChequeAdditionalPaymentResponse).cashierAdditionalPaymentDocs as Array<any>) || [];
            let hasImg = cashierAdditionalPaymentDocs?.some(f => f.uploadTimestamp);
            let docs = hasImg
              ? cashierAdditionalPaymentDocs?.filter(f => f.uploadTimestamp)
              : cashierAdditionalPaymentDocs;
            const init = [
              {
                documentTemplate: {
                  documentTemplateId: docs.length > 0 ? docs[0]?.cashierDocTemplate?.documentTemplateId : '',
                  documentName: docs.length > 0 ? docs[0]?.cashierDocTemplate?.documentTemplateName : '',
                },
                imageId: docs.length > 0 ? docs[0]?.imageId : '',
                documentId: docs.length > 0 ? docs[0]?.documentId : '',
                uploadTimestamp: docs.length > 0 ? docs[0]?.uploadTimestamp : '',
                documentTemplateId: docs.length > 0 ? docs[0].cashierDocTemplate?.documentTemplateId : '',
                active: true,
                isUpload: docs.length > 0 ? !!docs[0]?.uploadTimestamp : false,
                removeDocument: true,
              },
            ];
            cashierForm.addControl('cashierAdditionalPaymentDocs', new UntypedFormControl(docs));
            cashierForm.addControl('allDocuments', new UntypedFormControl(init));
            cashierForm.addControl(
              'additionalPaymentDocs',
              new UntypedFormControl(
                {
                  name: docs?.length > 0 ? docs[0]?.cashierDocTemplate?.documentTemplateName : '',
                  uploadSessionId: docs?.length > 0 ? docs[0]?.imageId : '',
                },
                !cashier.actionFlag ? null : Validators.required
              )
            );
            cashierForm.addControl(
              'hasDocument',
              new UntypedFormControl(!!docs[0]?.imageId, !cashier.actionFlag ? null : Validators.requiredTrue)
            );

            const orderListControl = cashierForm.controls['orderList'] as UntypedFormArray;
            const orderNumbersData = (cashier as CashierChequeAdditionalPaymentResponse).orderNumbers;
            if (orderNumbersData) {
              orderNumbersData.forEach(o => {
                orderListControl.push(
                  this.fb.group({
                    amount: o.amount || undefined,
                    no: o.no || undefined,
                    orderPaymentDate: o.orderPaymentDate || undefined,
                  })
                );
              });
            }
          } else {
            let deedGroupCtr = cashierForm.controls['deedGroupRecordList'] as UntypedFormArray;
            let dataDeedGroup = (cashier as AuctionCashierChequeCollateralsInfoResponse).deedGroupRecordList;
            if (dataDeedGroup) {
              for (let j = 0; j < dataDeedGroup?.length; j++) {
                const deed = dataDeedGroup[j];
                deedGroupCtr.push(
                  this.fb.group({
                    amount: deed.amount || null,
                    buyerType: deed.buyerType || null,
                    deedGroupId: deed.deedGroupId || null,
                    feeAmount: deed.feeAmount || null,
                    fsubbidnum: deed.fsubbidnum || null,
                    no: deed.no || null,
                    orderPaymentDate: deed.orderPaymentDate || null,
                    soldPrice: deed.soldPrice || null,
                  })
                );
              }
            }
          }

          cashierCtr.push(cashierForm);
        }
      }
      return form;
    } else {
      return this.fb.group({
        cashierCheque: this.fb.array([]),
      });
    }
  }

  public debtForm!: UntypedFormGroup;
  getDebtForm(data?: any) {
    if (data) {
      let chequeAmount = Utils.numberWithCommas(data?.chequeAmount);
      let form = this.fb.group({
        chequeAmount: [chequeAmount || ''],
        creditNoteRefNo: [data?.creditNoteRefNo || ''],
        creditNoteOrganizationId: [data?.creditNoteOrganizationId || ''],
        litigationsList: this.fb.array([]),
        reviewResult: [data?.approval?.reviewResult || ''],
        rejectReason: [data?.approval?.rejectReason || ''],
        totalSoldPrice: [data?.totalSoldPrice || ''],
        debitPercentage: [data?.debitPercentage || ''],
        availableDebtSettlementAmount: [data?.availableDebtSettlementAmount || ''],
        auctionDebtSettlementAccountId: [data?.auctionDebtSettlementAccountId || ''],
        creditNoteOrganizationName: [data?.creditNoteOrganizationName || ''],
        makerId: [data?.makerId || ''],
        approverId: [data?.approverId || ''],
      });
      if (data?.chequeAmount && data?.chequeAmount > 0) {
        form.get('chequeAmount')?.setValidators(Validators.required);
      }
      if (!data?.creditNoteRefNo && (data.debitPercentage === 100 || data.debitPercentage === 15)) {
        form
          .get('creditNoteRefNo')
          ?.setValidators([Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{4}-\d-\d{4}$/m)]);
      }
      return form;
    } else {
      return this.fb.group({});
    }
  }

  public accountDocFollowupForm!: UntypedFormGroup;
  public isAccDocFollowupOnRequest: boolean = false;
  generateAuctionFollowAccDocForm(formGroup: UntypedFormGroup) {
    /* LEX2-18039-18046 */
    return this.fb.group({
      roundNo: [formGroup?.get('roundNo')?.value],
      certifyAccountWarrantStatus: [formGroup?.get('certifyAccountWarrantStatus')?.value, Validators.required],
      certifyAccountWarrantType: [formGroup?.get('certifyAccountWarrantType')?.value, Validators.required],
      certifyAccountWarrantDate: [formGroup?.get('certifyAccountWarrantDate')?.value, Validators.required],
      accountDocReceiveStatus: [formGroup?.get('accountDocReceiveStatus')?.value],
      accountDocVerifyStatus: [formGroup?.get('accountDocVerifyStatus')?.value, Validators.required],
      remark: [formGroup?.get('remark')?.value],
      accountDocVerifyResult: [formGroup?.get('accountDocVerifyResult')?.value, Validators.required],
      accountDocDeedGroups: [formGroup?.get('accountDocDeedGroups')?.value, Validators.required],
      debtSettlementAmount: [formGroup?.get('debtSettlementAmount')?.value, Validators.required],
      additionalPaymentAmount: [formGroup?.get('additionalPaymentAmount')?.value],
      chequeNo: [formGroup?.get('chequeNo')?.value, Validators.required],
      amount: [formGroup?.get('amount')?.value, [Validators.required]],
      chequeDate: [formGroup?.get('chequeDate')?.value, Validators.required],
      chequeBankCode: [formGroup?.get('chequeBankCode')?.value, Validators.required],
      chequeBranch: [formGroup?.get('chequeBranch')?.value, Validators.required],
      refNo: [formGroup?.get('refNo')?.value, Validators.required],
      recipientDeptCode: [formGroup?.get('recipientDeptCode')?.value],
      recipientDeptName: [formGroup?.get('recipientDeptName')?.value],

      submitUser: [formGroup?.get('submitUser')?.value],
      files: [formGroup?.get('files')?.value, Validators.required],
      isFilesValid: [formGroup?.get('isFilesValid')?.value],
    });
  }
  generateAuctionFollowAccDocFormNoRequiredMode(_aucFollowAccDocDto: AccountDocFollowup) {
    let _submitUser = '-';
    if (_aucFollowAccDocDto?.reviewInfo) {
      _submitUser = `${_aucFollowAccDocDto.reviewInfo[0]?.submitUserId || ''} - ${
        _aucFollowAccDocDto.reviewInfo[0]?.submitUserName || ''
      }`;
    }
    /* LEX2-18039-18046 */
    return this.fb.group({
      roundNo: [_aucFollowAccDocDto?.roundNo],
      certifyAccountWarrantStatus: [_aucFollowAccDocDto?.certifyAccountWarrantStatus || null],
      certifyAccountWarrantType: [_aucFollowAccDocDto?.certifyAccountWarrantType || null],
      certifyAccountWarrantDate: [_aucFollowAccDocDto?.certifyAccountWarrantDate || null],
      accountDocReceiveStatus: [_aucFollowAccDocDto?.accountDocReceiveStatus || null],
      accountDocVerifyStatus: [_aucFollowAccDocDto?.accountDocVerifyStatus || null],
      remark: [_aucFollowAccDocDto?.remark || ''],
      accountDocVerifyResult: [_aucFollowAccDocDto?.accountDocVerifyResult || null],
      accountDocDeedGroups: [_aucFollowAccDocDto?.accountDocDeedGroups || null],
      debtSettlementAmount: [_aucFollowAccDocDto?.debtSettlementAmount || null],
      additionalPaymentAmount: [_aucFollowAccDocDto?.additionalPaymentAmount || null],
      chequeNo: [_aucFollowAccDocDto?.cashierChequeInfo?.chequeNo || null],
      amount: [_aucFollowAccDocDto?.cashierChequeInfo?.amount || null],
      chequeDate: [_aucFollowAccDocDto?.cashierChequeInfo?.chequeDate || null],
      chequeBankCode: [_aucFollowAccDocDto?.cashierChequeInfo?.chequeBankCode || null],
      chequeBranch: [_aucFollowAccDocDto?.cashierChequeInfo?.chequeBranch || null],
      refNo: [_aucFollowAccDocDto?.creditNoteInfo?.refNo || null],
      recipientDeptCode: [_aucFollowAccDocDto?.creditNoteInfo?.recipientDeptCode],
      recipientDeptName: [_aucFollowAccDocDto?.creditNoteInfo?.recipientDeptName],
      submitUser: [_submitUser],
      files: [{ value: null, disabled: false }],
      isFilesValid: [true],
    });
  }
  getAuctionFollowAccDocScenario(dataForm: UntypedFormGroup): AccDocScenario.AccDocScenarioEnum | null {
    const certifyAccountWarrantStatus = dataForm.get('certifyAccountWarrantStatus')?.value;
    const certifyAccountWarrantType = dataForm.get('certifyAccountWarrantType')?.value;
    const accountDocVerifyStatus = dataForm.get('accountDocVerifyStatus')?.value;
    const accountDocVerifyResult = dataForm.get('accountDocVerifyResult')?.value;
    const debtSettlementAmount = dataForm.get('debtSettlementAmount')?.value;

    if (
      certifyAccountWarrantStatus === CertifyAccountWarrantStatus.RECEIVE &&
      certifyAccountWarrantType === CertifyAccountWarrantType.VALID_WARRANT &&
      accountDocVerifyStatus === AccountDocVerifyStatus.IN_PROCESS
    ) {
      return AccDocScenario.AccDocScenarioEnum.S1;
    } else if (
      certifyAccountWarrantStatus === CertifyAccountWarrantStatus.RECEIVE &&
      certifyAccountWarrantType === CertifyAccountWarrantType.VALID_WARRANT &&
      accountDocVerifyStatus === AccountDocVerifyStatus.VERIFIED &&
      accountDocVerifyResult === AccountDocVerifyResult.INVALID_DATA
    ) {
      return AccDocScenario.AccDocScenarioEnum.S2;
    } else if (certifyAccountWarrantStatus === CertifyAccountWarrantStatus.NOT_RECEIVE) {
      return AccDocScenario.AccDocScenarioEnum.S3;
    } else if (
      certifyAccountWarrantStatus === CertifyAccountWarrantStatus.RECEIVE &&
      certifyAccountWarrantType === CertifyAccountWarrantType.INVALID_WARRANT
    ) {
      return AccDocScenario.AccDocScenarioEnum.S4;
    } else if (
      certifyAccountWarrantStatus === CertifyAccountWarrantStatus.RECEIVE &&
      certifyAccountWarrantType === CertifyAccountWarrantType.VALID_WARRANT &&
      accountDocVerifyStatus === AccountDocVerifyStatus.VERIFIED &&
      accountDocVerifyResult === AccountDocVerifyResult.VALID_DATA
    ) {
      if (Number(debtSettlementAmount || 0) > 0) {
        return AccDocScenario.AccDocScenarioEnum.S5_1;
      } else if (Number(debtSettlementAmount || 0) <= 0) {
        return AccDocScenario.AccDocScenarioEnum.S5_2;
      }
    }
    return null;
  }

  clearData(): void {
    this.auctionPaymentType = null;
    this.actionCode = '';
    this.actionType = '';
    this.litigationId = '';
    this.litigationCaseId = '' || 0;
    this.auctionExpenseId = '';
    this.taskDetail.clearAllData();
    this.hideContentHeader = false;
    this.taskLedName = '';
    this.taskService.clearData();
    this._auctionMenu = null;
    this.auctionInfoResponse = {};
    this.conveyanceDocumentUploads = {};
    this.litigationCaseService.litigationCaseShortDetail = {};
    this.clearAuctionFormData();
    this.appointmentInfo = [];
    this.auctionExpenseInfo = {};
    this.submitResultStatus = false;
    this.itemActionCode = '' as SubmitAuctionResultAction;
    this.debtSettlement = {};
    this.hasSubmitPermission = false;
    this.auctionBiddingCollateralsSummaryResponse = {};
    this.relatedDeedGroupIDs = [];
    this.conveyanceHasEdit = false;
    this.debitBalance = 0;
    this.debtTotal = {};
    this.chequeAmount = 0;
    this.conveyanceStatus = '' as ConveyanceStatus;
    this.auctionCaseTypeCode = '';
  }

  clearAuctionFormData(): void {
    const auctionPaymentService = this.injector?.get(AuctionPaymentService);
    auctionPaymentService?.paymentOrderFormGroup?.reset();
    auctionPaymentService.auctionReceiptDto = {};
    auctionPaymentService.auctionInvoiceDto = {};
    auctionPaymentService?.onTest?.reset();
  }

  async getAuctionCollateral(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionCollateral(aucRef))
    );
  }

  async getAuctionResolutionsLatest(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionResolutionsLatest(aucRef))
    );
  }

  async getInquiryBiddingCollaterals(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.inquiryBiddingCollaterals(aucRef))
    );
  }

  async getAuctionBiddingAnnounceResult(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.getAuctionBiddingAnnounceResult(aucRef))
    );
  }

  async getAuctionBiddingCollateralsSummary(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.getAuctionBiddingCollateralsSummary(aucRef))
    );
  }

  async getInquiryLatestResolutionInfo(deedGroupId: number): Promise<LatestResolutionInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryLatestResolutionInfo(deedGroupId))
    );
  }

  async getAuctionBiddingDeedGroup(
    aucBiddingId: string,
    deedGroupId: number
  ): Promise<AuctionBiddingDeedGroupResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.getAuctionBiddingDeedGroup(aucBiddingId, deedGroupId))
    );
  }

  async getAuctionBiddingResultResponse(aucBiddingId: string): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.getAuctionBiddingResultResponse(aucBiddingId))
    );
  }

  async getAuctionResolutionsHistory(aucRef: number): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionResolutionsHistory(aucRef))
    );
  }

  getAuctionAnnounces(aucStatus: Array<string>): Promise<Array<InquiryAnnouncesResponse>> {
    return this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryAnnounces(aucStatus))
    );
  }

  async getAuctionLexsSeizures(): Promise<AuctionLexsSeizuresResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionLexsSeizures())
    );
  }

  async getInquirySeizureInfo(
    aucRef: number,
    ledId: number,
    litigationCaseId: number
  ): Promise<AuctionLexsCollateralResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquirySeizureInfo(aucRef, litigationCaseId, ledId))
    );
  }

  async getAuctionBidingInfo(aucBiddingId: string): Promise<LatestPublicAuctionBiddingResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.getLatestPublicAuctionBidding(aucBiddingId))
    );
  }

  async getAuctionAnnounceProcess(caseId: any, ledId: any): Promise<Array<AuctionLedsAnnouncesResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionLitigationCaseControllerService.getAuctionLitigationAnnouncesProcess(caseId, ledId))
    );
  }

  async getAuctionAnnounceComplete(caseId: any, ledId: any): Promise<Array<AuctionLedsAnnouncesResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionLitigationCaseControllerService.getAuctionLedsAnnouncesResult(caseId, ledId))
    );
  }

  async getAuctionExpenseInfo(auctionExpenseId: number): Promise<AuctionExpenseInfo> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryAuctionExpenseInfo(auctionExpenseId))
    );
  }

  async postNotProcessReason(aucRef: number, request: AuctionReasonRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.submitNotProcessReason(aucRef, request)),
      {
        notShowAsSnackBar: true,
        disableErrorDisplay: true,
      }
    );
  }

  async postReProcessReason(aucRef: number, request: AuctionReasonRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.submitReProcessReason(aucRef, request)),
      {
        notShowAsSnackBar: true,
        disableErrorDisplay: true,
      }
    );
  }

  async postAdjustSubmitAuctionLitigationCase(aucRef: number, request: AdjustSubmitRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.adjustSubmitAuctionLitigationCase(aucRef, request))
    );
  }

  async postUnmatchAuctionLitigationCase(aucRef: number, request: AdjustSubmitRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.unmatchAuctionLitigationCase(aucRef, request))
    );
  }

  async postSubmitAuctionLitigationCase(aucRef: number) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.submitAuctionLitigationCase(aucRef)),
      {
        notShowAsSnackBar: true,
        disableErrorDisplay: true,
      }
    );
  }

  async postSubmitAuctionAssignLawyer(taskId: number, request: SubmitAuctionAssignLawyerRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.submitAuctionAssignLawyer(taskId, request))
    );
  }

  async postAuctionMatch(aucRef: number, request: AuctionMatchRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.auctionMatch(aucRef, request)));
  }

  async postSubmitAuctionExpense(request: AuctionExpenseRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.submitAuctionExpense(request))
    );
  }

  async postCollateralValidate(request: AuctionCollateralValidateRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.collateralValidate(request)),
      {
        notShowAsSnackBar: true,
        disableErrorDisplay: true,
      }
    );
  }

  async postCollateralMatch(request: AuctionCollateralMatchRequest) {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.collateralMatch(request)),
      {
        notShowAsSnackBar: true,
        disableErrorDisplay: true,
      }
    );
  }

  async getInquiryAuctionCashierChequeCollateralsInfo(
    aucRef?: number,
    cashierCollateralId?: number,
    taskId?: any
  ): Promise<Array<AuctionCashierChequeCollateralsInfoResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionControllerService.inquiryAuctionCashierChequeCollateralsInfo(aucRef, cashierCollateralId, taskId)
      )
    );
  }

  async getCashierChequeAdditionalPayment(
    additionalPaymentCashierId?: number,
    aucRef?: number
  ): Promise<Array<CashierChequeAdditionalPaymentResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getCashierChequeAdditionalPayment(aucRef, additionalPaymentCashierId))
    );
  }

  async submitAuctionCashierAdditionalPayment(
    request: AuctionCashierAdditionalPaymentSubmitRequest
  ): Promise<AuctionCashierAdditionalPaymentSubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.submitAuctionCashierAdditionalPayment(request))
    );
  }

  async validateAdditionalPayment(request: AuctionAdditionalPaymentRequest): Promise<AuctionAdditionalPaymentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.validateAdditionalPayment(request))
    );
  }

  async getAuctionCashierStampDuty(
    aucRef?: number,
    cashierCollateralId?: number,
    taskId?: any
  ): Promise<Array<AuctionCashierStampDutyResponse>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionCashierStampDuty(aucRef, cashierCollateralId, taskId))
    );
  }

  async postAuctionCashierSubmit(request: AuctionCashierCollateralRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.submitAuctionCashierSubmit(request))
    );
  }

  async postAuctionCashierChequeApproval(auctionCollateralId: number, request: AuctionCashierApprovalRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.auctionCashierChequeApproval(auctionCollateralId, request))
    );
  }

  async getCashierChequeBranchList(): Promise<AuctionCashierChequeBranchListResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionCashierChequeBranchList())
    );
  }

  async getBiddingCollateralsByDeedGroupId(aucRef: number, deedGroupId: number): Promise<InquiryDeedGroupResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.inquiryBiddingCollateralsByDeedGroupId(aucRef, deedGroupId))
    );
  }

  async postAuctionBiddingResultRecordingTasksSubmit(
    aucBiddingId: string,
    taskId: number,
    request: AuctionBiddingResultRecordingTasksSubmitRequest
  ): Promise<AuctionBiddingResultRecordingTasksSubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.auctionBiddingResultRecordingTasksSubmit(aucBiddingId, taskId, request)
      )
    );
  }

  async postAuctionBiddingResult(
    aucBiddingId: string,
    request: AuctionBiddingResultsRequest
  ): Promise<AuctionBiddingResultsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionBidControllerService.auctionBiddingResult(aucBiddingId, request))
    );
  }

  async postInquiryBiddingByAucBiddingIdAndDeedGroupId(
    aucBiddingId: string,
    deedGroupId: number,
    request: AuctionBiddingDocumentRequest
  ): Promise<AuctionBiddingDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.updateBiddingByAucBiddingIdAndDeedGroupId(aucBiddingId, deedGroupId, request)
      )
    );
  }

  async postBiddingsDocumentsUpload(
    aucBiddingId: string,
    file: Blob,
    documentGroup?: string,
    documentTemplateId?: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.biddingsDocumentsUpload(
          aucBiddingId,
          documentGroup || '',
          documentTemplateId || '',
          file
        )
      )
    );
  }

  async postDeleteBiddingsDocumentsUpload(aucBiddingId: string, documentGroup: string, documentTemplateId: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.deleteBiddingDocuments_1(
          aucBiddingId,
          documentGroup || '',
          documentTemplateId || ''
        )
      )
    );
  }

  async postBiddingsDeedGroupsDocumentsUpload(
    aucBiddingDeedGroupId: number,
    aucBiddingId: string,
    file: Blob,
    documentGroup?: string,
    documentTemplateId?: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.biddingsDeedGroupsDocumentsUpload(
          aucBiddingDeedGroupId,
          aucBiddingId,
          documentGroup || '',
          documentTemplateId || '',
          file
        )
      )
    );
  }

  async postDeleteBiddingsDeedGroupsDocumentsUpload(
    aucBiddingDeedGroupId: number,
    aucBiddingId: string,
    documentGroup: string,
    documentTemplateId: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionBidControllerService.deleteBiddingDocuments(
          aucBiddingDeedGroupId,
          aucBiddingId,
          documentGroup || '',
          documentTemplateId || ''
        )
      )
    );
  }

  async postSubmitAuctionCashierChequeStampDuty(
    request: AuctionCashierStampDutySubmitRequest
  ): Promise<AuctionCashierStampDutySubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.submitAuctionCashierChequeStampDuty(request))
    );
  }

  async postAuctionCashierChequeStampDutyApproval(
    stampDutyId: number,
    request: AuctionCashierApprovalRequest
  ): Promise<AuctionCashierStampDutySubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.auctionCashierChequeStampDutyApproval(stampDutyId, request))
    );
  }

  async auctionCashierChequeAdditionalApproval(
    auctionCollateralId: number,
    request: AuctionCashierAdditionApprovalRequest
  ): Promise<any> {
    return (
      await this.errorHandlingService.invokeNoRetry(() =>
        lastValueFrom(
          this.financialControllerService.auctionCashierChequeAdditionalApproval(auctionCollateralId, request)
        )
      ),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  async getChequeInfo(deedGroupId: number, type: string): Promise<Array<ChequeInfoItem>> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getChequeInfo(deedGroupId, type))
    );
  }

  public routeCorrection(path: string): string {
    const _prefix = this.routerService.currentRoute.split('/');
    const _prefixPath = `/${_prefix[1]}/${_prefix[2]}/auction/${path}`;
    return _prefixPath;
  }

  public getUniqueListByValue(arr: SimpleSelectOption[]) {
    return [...new Map(arr.map(item => [item['value'], item])).values()];
  }

  public prependDefaultValue(text: string) {
    return { text: text, value: 'All' } as SimpleSelectOption;
  }

  public async handleErrorForAuction(error: any) {
    let errors = error?.error?.errors;
    if (errors && errors.length > 0) {
      const errorCode = errors[0].code;
      if (errorCode === ERROR_CODE.EAUC001 || errorCode === ERROR_CODE.AUC001) {
        const res = await this.notificationService.confirm(
          'ทำรายการไม่สำเร็จ',
          'เนื่องจากมีผู้อื่นดำเนินการไปแล้ว โปรดเลือกรายการใหม่',
          { rightButtonLabel: 'COMMON.BUTTON_ACKNOWLEDGE', buttonIconName: 'icon-Selected' }
        );
        if (res) {
          this.routerService.navigate('/main/external-documents/annoucement-ktb');
        }
      } else {
        this.errorHandlingService.showAlertMessage(error);
      }
    }
  }

  public auctionSubmitResultPerCollateralForm!: UntypedFormGroup;
  getAuctionSubmitResultPerCollateralForm(data?: AuctionBiddingDeedGroupResponse, returnCheque?: ChequeInfoItem) {
    if (data) {
      return this.fb.group({
        liticationType: ['แพ่ง'],
        aucRound: [data?.aucLedSeq],
        bidDate: [data?.bidDate],
        aucResult: [data?.aucBiddingResult?.aucResult || ''],
        buyerType: [data?.aucBiddingResult?.buyerType || ''],
        buyerName: [data?.aucBiddingResult?.buyerName || ''],
        soldPrice: [data?.aucBiddingResult?.soldPrice || ''],
        soldDate: [data?.aucBiddingResult?.soldDate || ''],
        unsoldObjectHighestBidder: [data?.aucBiddingResult?.unsoldObjectHighestBidder || ''],
        unsoldObjectBuyer: [data?.aucBiddingResult?.unsoldObjectBuyer || ''],
        unsoldObjectPrice: [data?.aucBiddingResult?.unsoldObjectPrice || ''],
        unsoldObjectDissident: [data?.aucBiddingResult?.unsoldObjectDissident || ''],
        unsoldReasonType: [data?.aucBiddingResult?.unsoldReasonType || ''],
        cancelReasonType: [data?.aucBiddingResult?.cancelReasonType || ''],
        remark: [data?.aucBiddingResult?.remark || ''],
        aucBiddingDeedGroupDocuments: [data.aucBiddingDeedGroupDocuments],
        requireResultDocument: [data?.aucBiddingResult?.requireResultDocument],
        requireReturnDocument: [data?.aucBiddingResult?.requireReturnDocument],
        returnDocumentNo: [data?.aucBiddingResult?.returnDocumentNo || returnCheque?.chequeNo || ''],
        returnDocumentRemark: [data?.aucBiddingResult?.returnDocumentRemark || ''],
      });
    } else {
      return this.fb.group({
        liticationType: ['แพ่ง'],
        aucRound: [''],
        bidDate: [''],
        aucResult: [''],
        buyerType: [''],
        buyerName: [''],
        soldPrice: [''],
        soldDate: [''],
        unsoldObjectBuyer: [''],
        unsoldObjectHighestBidder: [''],
        unsoldObjectPrice: [''],
        unsoldObjectDissident: [''],
        unsoldReasonType: [''],
        cancelReasonType: [''],
        remark: [''],
        aucBiddingDeedGroupDocuments: [null],
        requireResultDocument: [''],
        requireReturnDocument: [''],
        returnDocumentNo: [''],
        returnDocumentRemark: [''],
      });
    }
  }

  public auctionResultBidForm!: UntypedFormGroup;
  getAuctionResultBidForm(data?: any) {
    if (data) {
      return this.fb.group({
        auctionResult: [data?.unsoldReasonType || ''],
        remark: [data?.remark || ''],
        aucResult: [data?.aucResult],
        aucLedSeq: [data?.aucLedSeq],
        soldDate: [data?.soldDate],
        bidDate: [data?.bidDate],
        aucBiddingDeedGroupStatus: [data?.aucBiddingDeedGroupStatus],
        aucRound: [data?.aucRound],
        liticationType: [data?.liticationType],
        buyerType: [data?.buyerType],
        buyerName: [data?.buyerName],
        soldPrice: [data?.soldPrice],
        aucBiddingDeedGroupDocuments: [data?.aucBiddingDeedGroupDocuments],
      });
    } else {
      return this.fb.group({
        auctionResult: [''],
        remark: [''],
        aucResult: [''],
        aucLedSeq: [''],
        soldDate: [''],
        bidDate: [''],
        aucBiddingDeedGroupStatus: [''],
        aucRound: [''],
        liticationType: [''],
        buyerType: [''],
        buyerName: [''],
        soldPrice: [''],
        aucBiddingDeedGroupDocuments: [],
      });
    }
  }

  // externalPaymentTracking
  public externalPaymentTrackingResponse!: any;
  async getExternalPaymentTracking(externalPaymentTrackingId: number): Promise<ExternalPaymentTrackingResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.externalPaymentTracking(externalPaymentTrackingId))
    );
  }

  public auctionSubmitResultForm!: UntypedFormGroup;
  getAuctionSubmitResultForm(data?: IUploadMultiFile[], attendAuctionFlag?: boolean) {
    if (data) {
      return this.fb.group({
        aucBiddingDocuments: [data],
        attendAuctionFlag: [attendAuctionFlag, []],
      });
    } else {
      return this.fb.group({
        aucBiddingDocuments: [],
        attendAuctionFlag: [false, []],
      });
    }
  }
  public auctionSubmitResultPerCollateralFiles!: UntypedFormGroup;
  getAuctionSubmitResultPerCollateralFiles(data?: IUploadMultiFile[]) {
    if (data) {
      return this.fb.group({
        aucBiddingDeedGroupDocuments: [data],
      });
    } else {
      return this.fb.group({
        aucBiddingDeedGroupDocuments: [],
      });
    }
  }

  public auctionSubmitResultPerCollateralReturnFiles!: UntypedFormGroup;
  getAuctionSubmitResultPerCollateralReturnFiles(data?: IUploadMultiFile[]) {
    if (data) {
      return this.fb.group({
        aucBiddingDeedGroupDocuments: [data],
      });
    } else {
      return this.fb.group({
        aucBiddingDeedGroupDocuments: [],
      });
    }
  }

  async postExternalPaymentTrackingSubmit(externalPaymentTrackingId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.externalPaymentTrackingSubmit(externalPaymentTrackingId))
    );
  }

  async getAuctionDebtSettlementAccount(
    auctionDebtSettlementAccountId: number
  ): Promise<DebtSettlementAccountResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.debtSettlementAccountControllerService.getAuctionDebtSettlementAccount(auctionDebtSettlementAccountId)
      )
    );
  }

  async submitAuctionDebtSettlement(request: AuctionDebtSettlementRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.debtSettlementAccountControllerService.submitAuctionDebtSettlement(request))
    );
  }

  async getMasTransferProperty(deedGroupId: number): Promise<ConveyanceMasTransferResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getMasTransferProperty(deedGroupId))
    );
  }

  mapLawyer() {
    return this.userService.kLawyerUserOptions.map(i => {
      let nameValuePair: NameValuePair = {
        name: `${i.userId} - ${i.name} ${i.surname}`,
        value: i.userId,
      };
      return nameValuePair;
    });
  }

  async getConveyanceAnnouncesDocuments(deedGroupId: number): Promise<ConveyanceAnnouncesDocumentsResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getConveyanceAnnouncesDocuments(deedGroupId))
    );
  }
  async getCashierChequeTransferOwnership(
    cashierTransferOwnershipId?: number,
    deedGroupId?: number
  ): Promise<Array<CashierChequeTransferOwnershipResponse>> {
    return await this.errorHandlingService.invokeNoRetry(
      () =>
        lastValueFrom(
          this.auctionControllerService.getCashierChequeTransferOwnership(cashierTransferOwnershipId, deedGroupId)
        ),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  async getMasAppointmentInfo(deedGroupId: number): Promise<MasAppointmentInfoResponse[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getMasAppointmentInfo(deedGroupId))
    );
  }

  async getExternalPaymentTrackingDeedGroupLatest(aucBiddingDeedGroupId: number): Promise<CollateralGroup> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.externalPaymentTrackingDeedGroupLatest(aucBiddingDeedGroupId))
    );
  }
  async auctionCashierChequeTransferOwnershipApproval(
    request: AuctionCashierTransferOwnershipApprovalRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.auctionCashierChequeTransferOwnershipApproval(request))
    );
  }
  async submitAuctionCashierChequeTransferOwnership(
    request: AuctionCashierTransferOwnershipSubmitRequest
  ): Promise<AuctionCashierTransferOnwershipSubmitResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionControllerService.submitAuctionCashierChequeTransferOwnership(request)),
      { notShowAsSnackBar: true }
    );
  }

  async auctionCashierChequeExpenseApproval(
    auctionExpenseId: number,
    request: AuctionCashierExpenseApprovalRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.auctionCashierChequeExpenseApproval(auctionExpenseId, request))
    );
  }
  async reCalculateAuctionDebtSettlementAccountChequeAmount(
    request: AuctionDebtSettlementAccountUpdateRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.debtSettlementAccountControllerService.reCalculateAuctionDebtSettlementAccountChequeAmount(request)
      )
    );
  }

  async approveReceiptAuctionExpenseNonEFilling(
    auctionExpenseId: number,
    taskId: number,
    request: PostApprovalRequest
  ): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.auctionExpenseControllerService.approveReceiptAuctionExpenseNonEFilling(auctionExpenseId, taskId, request)
      )
    );
  }

  async openConfirmBackToEdit(_submitResultStatus?: boolean) {
    const res = await this.sessionService.confirmExitWithoutSave();
    if (!res) return;
    if (typeof _submitResultStatus === 'boolean') {
      this.submitResultStatus = _submitResultStatus;
    }
    this.routerService.back();
  }

  async approvalAuctionDebtSettlementAccount(request: AuctionDebtSettlementAccountApprovalRequest): Promise<any> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.auctionDebtSettlementControllerService.approvalAuctionDebtSettlementAccount(request)),
      {
        notShowAsSnackBar: true,
      }
    );
  }

  async downloadCreditNote(objectId: string, objectType: string): Promise<DocumentDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.financialControllerService.downloadCreditNote(objectId, objectType))
    );
  }

  async getAuctionDeedInfo(aucRef: number, auctionDeedInfo: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getAuctionDeedInfo(aucRef, auctionDeedInfo))
    );
  }

  async postDeedInfoMatch(aucRef: number, auctionDeedInfoMatchRequest: AuctionDeedInfoMatchRequest) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.postDeedInfoMatch(aucRef, auctionDeedInfoMatchRequest))
    );
  }

  async deleteAuctionUnmatch(aucRef: number, deedId: number) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.deleteAuctionUnmatch(aucRef, deedId))
    );
  }

  async inquiryLedInfoPreferential(litigationId: string): Promise<LedInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryLedInfoPreferential(litigationId))
    );
  }
}
