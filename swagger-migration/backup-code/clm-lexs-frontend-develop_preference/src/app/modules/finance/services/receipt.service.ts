import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  ReceiptKcorpSearchConditionRequest,
  ReceiptSearchConditionRequest,
} from '@app/shared/components/search-controller/search-controller.model';
import { BlobType, FileType, statusCode, taskCode } from '@app/shared/models';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { LoggerService } from '@app/shared/services/logger.service';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { SessionService } from '@app/shared/services/session.service';
import { Utils } from '@app/shared/utils/util';
import {
  CommonResponse,
  CourtReceiveOrderDto,
  ExpenseMemoDto,
  LitigationTransactionDto,
  NameValuePair,
  PageOfReceiveKcorpInquiryInfoResponse,
  PageOfReceiveKcorpPaymentInfoResponse,
  ReceiveAccountCode,
  ReceiveControllerService,
  ReceiveOrderDto,
  ReceiveTransactionDto,
  TransferOrderDto,
  TransferOrderRequest,
  TransferTransactionDto,
  WashAccountMasterDto,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private _receiveOrderError: any = {
    receiveType: false,
    totalAndreRerenceAmount: false,
  };

  constructor(
    private receiveControllerService: ReceiveControllerService,
    private errorHandlingService: ErrorHandlingService,
    private logger: LoggerService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    private sessionService: SessionService,
    private masterData: MasterDataService
  ) {}

  public receiptLandingTab: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private _receiveDetailKcorp: PageOfReceiveKcorpInquiryInfoResponse | undefined;
  set receiveDetailKcorp(data: PageOfReceiveKcorpInquiryInfoResponse | undefined) {
    this._receiveDetailKcorp = data;
  }
  get receiveDetailKcorp() {
    return this._receiveDetailKcorp;
  }

  private _referenceNoDetail: PageOfReceiveKcorpPaymentInfoResponse | undefined;
  set referenceNoDetail(data: PageOfReceiveKcorpPaymentInfoResponse | undefined) {
    this._referenceNoDetail = data;
  }
  get referenceNoDetail() {
    return this._referenceNoDetail;
  }

  private _receiveOrders!: ReceiveOrderDto;
  set receiveOrders(value: ReceiveOrderDto) {
    this._receiveOrders = value;
  }
  get receiveOrders() {
    return this._receiveOrders;
  }

  private _receiveOrdersKcorp!: CourtReceiveOrderDto;
  set receiveOrdersKcorp(value: CourtReceiveOrderDto) {
    this._receiveOrdersKcorp = value;
  }
  get receiveOrdersKcorp() {
    return this._receiveOrdersKcorp;
  }

  set receiveOrderError(value: any) {
    this._receiveOrderError = value;
  }
  get receiveOrderError() {
    return this._receiveOrderError;
  }

  private _taskCode!: taskCode | null;
  set taskCode(value: any) {
    this._taskCode = value;
  }
  get taskCode() {
    return this._taskCode;
  }
  private _taskId!: taskCode | null;
  set taskId(value: any) {
    this._taskId = value;
  }
  get taskId() {
    return this._taskId;
  }
  private _receiveStatus!: ReceiveOrderDto.ReceiveStatusEnum;
  set receiveStatus(value: any) {
    this._receiveStatus = value;
  }
  get receiveStatus() {
    return this._receiveStatus;
  }
  private _statusCode!: statusCode;
  set statusCode(value: any) {
    this._statusCode = value;
  }
  get statusCode() {
    return this._statusCode;
  }
  private _currentAssigneeId!: string;
  set currentAssigneeId(value: any) {
    this._currentAssigneeId = value;
  }
  get currentAssigneeId() {
    return this._currentAssigneeId;
  }

  private _hasSuccessStatus: boolean = false;
  set hasSuccessStatus(value: any) {
    this._hasSuccessStatus = value;
  }
  get hasSuccessStatus() {
    return this._hasSuccessStatus;
  }

  private _isDownLoadList!: Array<boolean>;
  set isDownLoadList(value: Array<boolean>) {
    this._isDownLoadList = value;
  }
  get isDownLoadList() {
    return this._isDownLoadList;
  }

  private _currentTabIndex!: number;
  set currentTabIndex(value: any) {
    this._currentTabIndex = value;
  }
  get currentTabIndex() {
    return this._currentTabIndex;
  }

  private _receiveType!: string;
  set receiveType(value: any) {
    this._receiveType = value;
  }
  get receiveType() {
    return this._receiveType;
  }

  private _receiptNoOptions: NameValuePair[] = [];
  public get receiptNoOptions(): NameValuePair[] {
    return this._receiptNoOptions;
  }
  public set receiptNoOptions(value: NameValuePair[]) {
    this._receiptNoOptions =
      value.findIndex(i => i.value === 'N/A') === -1
        ? (
            [{ name: this.translate.instant('SEARCH_CONTROL.LABEL_ALL_RECEIPT_NO'), value: 'N/A' }] as NameValuePair[]
          ).concat(value)
        : value;
  }
  /** Receive APIs Controller */
  async getReceiveNoList(tab: string = 'USER') {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getReceiveNoList(tab))
    );
  }

  async getReceiveOrder(id: string) {
    this.logger.logAPIRequest('getReceiveOrder : ', id);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getReceiveOrder(id))
    );
  }

  async getWashAccountList(): Promise<WashAccountMasterDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getWashAccountList())
    );
  }

  async approve(taskId: number) {
    this.logger.logAPIRequest('approve : ', taskId);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.approve(taskId))
    );
  }

  async inquiryReceive(request: ReceiptSearchConditionRequest) {
    this.logger.logAPIRequest('inquiryReceive : ', request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveControllerService.inquiryReceive(
          request.beginCreateDate,
          request.endCreateDate,
          request.page || 0,
          request.receiveNo !== 'N/A' ? request.receiveNo : '',
          request.receiveStatus !== 'N/A' ? request.receiveStatus : '',
          request.receiveType !== 'N/A' ? request.receiveType : '',
          request.searchString || '',
          request.size || 10,
          request.sortBy || ['receiveNo'],
          request.sortOrder || 'ASC',
          request.tab || 'USER'
        )
      )
    );
  }

  async inquiryReceiveDownloadClosedTab(request: ReceiptSearchConditionRequest, filename: string) {
    this.logger.logAPIRequest('inquiryReceiveDownloadClosedTab : ', request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveControllerService.inquiryReceiveDownloadClosedTab(
          request.beginCreateDate,
          request.endCreateDate,
          request.page || 0,
          request.receiveNo !== 'N/A' ? request.receiveNo : '',
          request.receiveStatus !== 'N/A' ? request.receiveStatus : '',
          request.receiveType !== 'N/A' ? request.receiveType : '',
          request.searchString || '',
          request.size || 10,
          request.sortBy || ['receiveNo'],
          request.sortOrder || 'ASC',
          request.tab || 'USER'
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async inquiryReceiveDownload(request: ReceiptSearchConditionRequest, filename: string) {
    this.logger.logAPIRequest('inquiryReceiveDownload : ', request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveControllerService.inquiryReceiveDownload(
          request.beginCreateDate,
          request.endCreateDate,
          request.page || 0,
          request.receiveNo !== 'N/A' ? request.receiveNo : '',
          request.receiveStatus !== 'N/A' ? request.receiveStatus : '',
          request.receiveType !== 'N/A' ? request.receiveType : '',
          request.searchString || '',
          request.size || 10,
          request.sortBy || ['receiveNo'],
          request.sortOrder || 'ASC',
          request.tab || 'USER'
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async inquiryReceiveKcorp(request: ReceiptKcorpSearchConditionRequest) {
    this.logger.logAPIRequest('inquiryReceiveKcorp : ', request);
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveControllerService.inquiryReceiveKcorp(
          request.beginTransferMonth,
          request.endTransferMonth,
          request.page || 0,
          request.referenceNo || '',
          request.size || 10,
          request.sortBy || ['washAccountNo'],
          request.sortOrder || 'ASC',
          request.transferStatus !== 'N/A' ? request.transferStatus : '',
          request.washAccountNo !== 'N/A' ? request.washAccountNo : ''
        )
      )
    );
  }

  async inquiryReceiveKcorpDownload(request: ReceiptKcorpSearchConditionRequest, filename: string) {
    this.logger.logAPIRequest('inquiryReceiveKcorpDownload : ', request);
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.receiveControllerService.inquiryReceiveKcorpDownload(
          request.beginTransferMonth,
          request.endTransferMonth,
          request.page || 0,
          request.referenceNo || '',
          request.size || 10,
          request.sortBy || ['washAccountNo'],
          request.sortOrder || 'ASC',
          request.transferStatus !== 'N/A' ? request.transferStatus : '',
          request.washAccountNo !== 'N/A' ? request.washAccountNo : ''
        )
      )
    );
    Utils.saveAsStrToBlobFile(response, filename || 'งานทั้งหมด' + FileType.EXCEL_SHEET, BlobType.EXCEL_SHEET);
  }

  async downloadCreditNote(litigationCaseId: number, litigationId: string, receiveNo: string, filename?: string) {
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.downloadCreditNote(litigationCaseId, litigationId, receiveNo))
    );
    Utils.saveAsStrToBlobFile(response, filename || 'Credit Note' + FileType.PDF, BlobType.PDF);
  }

  async downloadCreditNoteAll(receiveNo: string, filename?: string) {
    const response = await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.downloadCreditNoteAll(receiveNo))
    );
    Utils.saveAsStrToBlobFile(response, filename || 'Credit Note' + FileType.PDF, BlobType.PDF);
  }

  async getRefundInfo(
    createDate: string,
    washAccountNo: string,
    page?: number | 0,
    size?: number | 10,
    taskId?: string
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getRefundInfo(createDate, washAccountNo, page, size, taskId))
    );
  }

  async getRefundInfoDetails(receiveNo: string, referenceNo: string, page?: number | 0, size?: number | 10) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getRefundInfoByReferenceNo(receiveNo, referenceNo, page, size))
    );
  }

  async getPaidAmount(referenceNo: string) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getPaidAmount(referenceNo))
    );
  }

  async search(searchString?: string): Promise<LitigationTransactionDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.search(searchString))
    );
  }

  async getTransferOrder(request: TransferOrderRequest): Promise<TransferOrderDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getTransferOrder(request))
    );
  }

  genRefundInfoForm(data: ReceiveOrderDto) {
    return this.fb.group({
      accountCode: data?.accountCode || null,
      cancelReason: data?.cancelReason || null,
      cancelReasonOther: data?.cancelReasonOther || null,
      editReason: data?.editReason || null,
      makerOrgId: this.sessionService.currentUser?.organizationCode || null,
      makerOrgName: this.sessionService.currentUser?.organizationName || null,
      paidAmount: data?.paidAmount || null,
      payAmount: data?.payAmount || null,
      payerType: data?.payerType || null,
      receiveDate: data?.receiveDate || null,
      receiveNo: data?.receiveNo || null,
      receiveReferenceNo: data?.receiveReferenceNo || null,
      receiveSource: data?.receiveSource || null,
      receiveStatus: data?.receiveStatus || null,
      receiveType: data?.accountCode || null,
      referenceNo: data?.referenceNo || null,
      remark: data?.remark || null,
      transferOrders: this.fb.array([], Validators.required),
      updateFlag: data?.updateFlag || null,
      sumTotalClearingAmount: data?.sumTotalClearingAmount || null,
      receiveStatusName: data?.receiveStatusName || '',
      rejectRequest: this.fb.group({
        reason: null,
      }),
    });
  }
  genRefundInfoKcorpForm(data: CourtReceiveOrderDto, receiveAccount: ReceiveAccountCode) {
    let form = this.fb.group({
      referenceNo: data.referenceNo || '',
      suspenseAccountDate: data.suspenseAccountDate || '',
      washAccountNo: data.washAccountNo || '',
      payAmount: data.payAmount,
      receiveType: data.receiveType,
      receiveStatusName: data.receiveStatusName || '',
      receiveTypeName: data.receiveTypeName || '',
      receiveNo: data.receiveNo || '',
      courtName: data.courtName || '',
      washAccountAmount: data.washAccountAmount || '',
      ref2: data.ref2 || '',
      ref1: data.ref1 || '',
      referenceAmount: data.referenceAmount,
      accountCode: receiveAccount ? receiveAccount?.code : '',
      transferOrders: this.fb.array([], Validators.required),
      outboundTransferTransaction: this.fb.array([]),
      taskUnprocess: data.taskUnprocess,
      unprocessReason: data.unprocessReason || '',
      rejectRequest: this.fb.group({
        reason: null,
      }),
    });
    let outTransCtr = form.get('outboundTransferTransaction') as UntypedFormArray;
    let outTrans = data.outboundTransferTransaction;
    if (outTrans) {
      for (let index = 0; index < outTrans?.length; index++) {
        const ot = outTrans[index];
        outTransCtr.push(
          this.fb.group({
            creditNoteReceiverOrgCode: [ot.creditNoteReceiverOrgCode || '', Validators.required],
            creditNoteDescription: ot.creditNoteDescription || '',
            hitCreditNote: ot.hitCreditNote || '',
            creditNoteReceiverOrgName: ot.creditNoteReceiverOrgName || '',
            id: ot.id || '',
            litigationCaseId: ot.litigationCaseId || '',
            litigationId: ot.litigationId || '',
            sendAmount: [ot.sendAmount || '', Validators.required],
          })
        );
      }
    }

    return form;
  }

  async checkReceiveOrderIsValid(control: UntypedFormGroup, _mode?: string): Promise<boolean> {
    let acc = await this.masterData.receiveAccountCode();
    let receiveAccountCode: ReceiveAccountCode[] = acc.receiveAccountCode || [];
    let totalAmount: any = this.sumTotalAmount(control);
    if (control.get('receiveType')?.value === ReceiveAccountCode.ReceiveTypeEnum.SuspenseCourt) {
      this.checkClearingAmount(control);
    }
    let receiveType = receiveAccountCode.find(f => f.code === control.get('receiveType')?.value)?.receiveType;
    let payAmount = Number(control.get('payAmount')?.value);
    if (receiveType === ReceiveAccountCode.ReceiveTypeEnum.InterOffice) {
      this.receiveOrderError.receiveType = !(totalAmount === payAmount);
    }
    if (receiveType === ReceiveAccountCode.ReceiveTypeEnum.Suspense) {
      this.receiveOrderError.receiveType = !(totalAmount <= payAmount);
    }
    if (control.get('receiveType')?.value === ReceiveAccountCode.ReceiveTypeEnum.SuspenseCourt) {
      let amount = Number(control.get('payAmount')?.value) || Number(control.get('referenceAmount')?.value);
      this.receiveOrderError.receiveType = !(totalAmount <= amount);
    }

    return !this.receiveOrderError.receiveType;
  }

  async getReceiveOrderRequest(
    headerFlag: ReceiveOrderDto.HeaderFlagEnum,
    control: UntypedFormGroup
  ): Promise<ReceiveOrderDto> {
    let acc = await this.masterData.receiveAccountCode();
    let receiveAccountCode: ReceiveAccountCode[] = acc.receiveAccountCode || [];
    const rawvalue = control?.getRawValue();
    let transferOrders = rawvalue.transferOrders.map((m: any, index: number) => {
      if (this.receiveOrders?.transferOrders) {
        let rawreceiveOrders = this.receiveOrders?.transferOrders![index] || ([] as Array<ReceiveTransactionDto>);
        if (m.receiveTransactions) {
          m.receiveTransactions = m.receiveTransactions.map((re: ReceiveTransactionDto, inx: number) => {
            if (rawreceiveOrders.receiveTransactions && rawreceiveOrders.receiveTransactions![inx]) {
              let rawReceiveTransactions = rawreceiveOrders.receiveTransactions![inx];
              re.id = rawReceiveTransactions.id;
            }
            return re;
          });
          if (
            m.transferTransactions.length > 0 &&
            JSON.stringify(m.transferTransactions[0]) !== '{}' &&
            (m.transferTransactions[0]?.creditNoteReceiverOrgCode ||
              m.transferTransactions[0]?.sendAmount ||
              m.transferTransactions[0]?.creditNoteDescription)
          ) {
            if (!m.transferTransactions[0]?.litigationCaseId) {
              m.transferTransactions[0].litigationCaseId = m.receiveTransactions[0]?.litigationCaseId;
            }
            if (!m.transferTransactions[0]?.litigationId) {
              m.transferTransactions[0].litigationId = m.receiveTransactions[0]?.litigationId;
            }
          } else {
            m.transferTransactions = [];
          }
        }
      }
      return m;
    });
    let request: ReceiveOrderDto = {
      ...rawvalue,
      receiveType: receiveAccountCode.find(f => f.code === rawvalue.receiveType)?.receiveType,
      accountCode: rawvalue.receiveType,
      headerFlag: headerFlag,
      transferOrders: transferOrders,
    };
    return request;
  }

  sumClearingAmountAmount(list: TransferOrderDto) {
    return list?.receiveTransactions
      ?.map(t => Number(t?.clearingAmount))
      .reduce((acc?: number, value?: number) => acc! + value!, 0);
  }

  getCourtReceiveOrderRequest(
    headerFlag: ReceiveOrderDto.HeaderFlagEnum,
    control: UntypedFormGroup
  ): CourtReceiveOrderDto {
    const rawvalue = control?.getRawValue();
    rawvalue.transferOrders = rawvalue?.transferOrders?.map((m: TransferOrderDto) => {
      m.sumClearingAmount = this.sumClearingAmountAmount(m);
      return m;
    });
    let request: CourtReceiveOrderDto = {};
    if (headerFlag === ReceiveOrderDto.HeaderFlagEnum.Cancel) {
      request = {
        ...rawvalue,
        cancelReason: rawvalue.rejectRequest.reason,
        headerFlag: headerFlag,
      };
      request.rejectRequest = undefined;
    } else {
      request = {
        ...rawvalue,
        headerFlag: headerFlag,
      };
    }
    return request;
  }

  async saveReceiveOrder(receiveOrder: ReceiveOrderDto, taskId?: number): Promise<CommonResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.saveReceiveOrder(receiveOrder, taskId))
    );
  }

  async getCourtReceiveOrder(receiveNo: string): Promise<CourtReceiveOrderDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getCourtReceiveOrder(receiveNo))
    );
  }
  async saveCourtReceiveOrder(taskId: number, request: CourtReceiveOrderDto): Promise<CommonResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.saveCourtReceiveOrder(taskId, request))
    );
  }

  async getMemo(receiveTransactionId: number): Promise<ExpenseMemoDto[]> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.receiveControllerService.getMemo(receiveTransactionId))
    );
  }

  async setReceiveOrder(id: string) {
    const response = await this.getReceiveOrder(id);
    this.receiveOrders = response;
    this.receiveStatus = response.receiveStatus;
  }

  checkClearingAmount(control: any) {
    let transferOrders = control.get('transferOrders') as UntypedFormArray;
    let list = transferOrders.value || [];
    for (let index = 0; index < list.length; index++) {
      const trf: any = list[index];
      let receiveT = trf.receiveTransactions
        ?.map((t: any) => Number(t?.clearingAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      let transferT = trf.transferTransactions
        ?.map((t: any) => Number(t?.sendAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      let total = receiveT + transferT;
      let courtRefundAmount = Number(trf.courtRefundAmount);
      if (!trf.courtRefundAmount) {
        transferOrders.at(index).get('hasErrorClearingAmount')?.setValue(false);
      } else {
        if (courtRefundAmount !== total) {
          transferOrders.at(index).get('hasErrorClearingAmount')?.setValue(false);
        } else {
          transferOrders.at(index).get('hasErrorClearingAmount')?.setValue(true);
        }
      }
    }
  }

  sumTotalAmount(control: UntypedFormGroup) {
    let list = control.get('transferOrders')?.value || [];
    let sum: number = 0;
    if (list && list.length > 0) {
      for (let index = 0; index < list?.length; index++) {
        const trf: any = list[index];
        let receiveT = trf.receiveTransactions
          ?.map((t: any) => Number(t?.clearingAmount))
          .reduce((acc?: number, value?: number) => acc! + value!, 0);
        let transferT = trf.transferTransactions
          ?.map((t: any) => Number(t?.sendAmount))
          .reduce((acc?: number, value?: number) => acc! + value!, 0);
        sum = sum + receiveT + transferT;
      }
    }
    let outboundTransferTransaction = control.get('outboundTransferTransaction')?.value || [];
    if (outboundTransferTransaction && outboundTransferTransaction.length > 0) {
      let outboundT = outboundTransferTransaction
        ?.map((t: any) => Number(t?.sendAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      sum = sum + outboundT;
    }
    return sum;
  }

  async genFormTransferOrders(transferOrders: TransferOrderDto[]): Promise<any> {
    let expense = await this.masterData.expenseReceive();
    let expenseReceiveOptions = expense.expenseReceive || [];
    let transferOrdersArr = [];
    for (let index = 0; index < transferOrders?.length; index++) {
      const tfo = transferOrders[index];
      let ctr = this.fb.group({
        isExpand: true,
        litigationId: tfo?.litigationId || null,
        litigationCaseId: tfo?.litigationCaseId || null,
        blackCaseNo: tfo?.blackCaseNo || null,
        redCaseNo: tfo?.redCaseNo || null,
        litigationStatusName: tfo?.litigationStatusName || null,
        orgCode: tfo?.orgCode || null,
        orgName: tfo?.orgName || null,
        mainBorrowers: this.fb.array([
          this.fb.group({
            mainBorrowerPersonName: tfo?.mainBorrowerPersonName || null,
            courtName: tfo?.courtName || null,
            responseUnitCode: tfo?.responseUnitCode || null,
            responseUnitName: tfo?.responseUnitName || null,
            branchCode: tfo?.branchCode || null,
            branchName: tfo?.branchName || null,
            courtRefundAmount: tfo?.courtRefundAmount || null,
          }),
        ]),
        courtRefundAmount: tfo?.courtRefundAmount,
        hasErrorClearingAmount: null,
        receiveTransactions: this.fb.array([]),
        transferTransactions: this.fb.array([]),
      });

      if (tfo?.receiveTransactions) {
        let receiveTransactions = ctr.get('receiveTransactions') as UntypedFormArray;
        for (let index = 0; index < tfo.receiveTransactions?.length; index++) {
          const recieveTran: ReceiveTransactionDto = tfo.receiveTransactions[index];
          let sortData = expenseReceiveOptions.filter((f: any) => f.expenseTypeCode === recieveTran?.expenseTypeCode);
          let receiveTypeOption = sortData.sort((n1, n2) => {
            if ((n1?.receiveTypeCode || '') > (n2?.receiveTypeCode || '')) {
              return 1;
            }
            if ((n1?.receiveTypeCode || '') < (n2?.receiveTypeCode || '')) {
              return -1;
            }
            return 0;
          });
          receiveTypeOption = receiveTypeOption.map(item => {
            if (item.receiveTypeCode === 'R00') {
              item.receiveTypeCode = undefined;
            }
            return item;
          });
          if (recieveTran?.processStatus === 'SUCESS') {
            this.hasSuccessStatus = true;
          }
          receiveTransactions.push(
            this.fb.group({
              id: recieveTran?.id || null,
              advancePaymentAccountNo: recieveTran?.advancePaymentAccountNo || null,
              expenseTypeCode: recieveTran?.expenseTypeCode || null,
              expenseTypeName: recieveTran?.expenseTypeName || null,
              totalAmount: recieveTran?.totalAmount || null,
              remainingAmount:
                recieveTran?.expenseTypeCode === 'E11' || recieveTran?.expenseTypeCode === 'E31'
                  ? recieveTran?.remainingAmount
                  : null,
              advancePaymentDate: recieveTran?.advancePaymentDate || null,
              processStatus: recieveTran?.processStatus || null,
              refTransactionId: recieveTran?.refTransactionId || null,
              refFinancialAccountId: recieveTran?.refFinancialAccountId || null,
              receiveTypeCode: [
                recieveTran?.receiveTypeCode || null,
                recieveTran.clearingAmount || 0 > 0 ? Validators.required : null,
              ],
              receiveTypeOption:
                receiveTypeOption.length > 0
                  ? this.fb.array(receiveTypeOption)
                  : this.fb.array([
                      {
                        receiveTypeDesc: 'R82-รับค่าทนายความ(KLS)',
                        receiveTypeCode: 'R82',
                      },
                    ]), // prod-defect : 134
              clearingAmount: recieveTran?.clearingAmount || null,
              receiveTypeName: recieveTran?.receiveTypeName || null,
              remark: [recieveTran?.remark || null],
              note: [recieveTran?.note || null],
              isExpand: true,
              litigationCaseId: recieveTran?.litigationCaseId,
              litigationId: recieveTran?.litigationId,
            })
          );
          console.log('receiveTransactions', receiveTransactions);
        }
      }
      if (tfo?.transferTransactions && tfo?.transferTransactions.length > 0) {
        for (let index = 0; index < tfo.transferTransactions?.length; index++) {
          const tts: TransferTransactionDto = tfo.transferTransactions[index];
          this.createFormTransferTransactions(ctr, tts);
        }
      } else {
        this.createFormTransferTransactions(ctr);
      }
      transferOrdersArr.push(ctr);
    }
    return transferOrdersArr;
  }

  createFormTransferTransactions(ctr: UntypedFormGroup, tts?: TransferTransactionDto) {
    let transferTransactions = ctr.get('transferTransactions') as UntypedFormArray;
    transferTransactions.push(
      this.fb.group({
        sendAmount: tts?.sendAmount || null,
        creditNoteReceiverOrgCode: tts?.creditNoteReceiverOrgCode || null,
        creditNoteReceiverOrgName: tts?.creditNoteReceiverOrgName || null,
        creditNoteDescription: tts?.creditNoteDescription || null,
        hitCreditNote: tts?.hitCreditNote || null,
        litigationCaseId: tts?.litigationCaseId,
        litigationId: tts?.litigationId,
        id: tts?.id || 0,
      })
    );
  }

  getReceiptOptionTab(index: number): string {
    let tab: string = 'USER';
    if (index === 1) {
      tab = 'ORG';
    } else if (index === 3) {
      tab = 'CLOSED';
    } else {
      tab = 'USER';
    }

    return tab;
  }

  clearData() {
    this._receiveOrders = {};
    this._receiveOrdersKcorp = {};
    this._receiveOrderError = {};
  }
}
