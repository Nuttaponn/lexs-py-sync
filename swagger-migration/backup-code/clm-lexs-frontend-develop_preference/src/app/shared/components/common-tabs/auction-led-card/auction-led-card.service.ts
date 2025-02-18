import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import {
  AccountDocumentDeedGroupsResponse,
  AccountDocumentFollowUpTaskApprovalRequest,
  AccountDocumentResultRecordingRequest,
  AccountDocumentValidationResponse,
  AccountDocumentsResponse,
  AdditionalExpenseAuctionDto,
  AuctionControllerService,
  AuctionLedsAnnouncesResponse,
  AuctionLigationCaseDebtSettlementAccountResponse,
  AuctionLitigationCaseControllerService,
  AuctionLitigationConveyanceProcessDto,
  AuctionResultRecordingSubmitRequest,
  ConveyanceControllerService,
  ConveyanceDocumentUploadResponse,
  ConveyanceUploadDocumentRequest,
  ConveyanceUploadDocumentResponse,
  DocConveyanceUploadValidationResponse,
  LedInfoResponse,
  PreferentialOrderInfo,
  SeizureInfoResponse,
} from '@lexs/lexs-client';
import { mockInquiryLedInfoPreferential, mockInquiryPreferentialOrderInfo } from 'mock/data/auction/auction.mock';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

export interface IActiveLed {
  activeLedId?: number;
  activeLedTab?: number;
  activeLedSubTab?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuctionLedCardService {
  constructor(
    private auctionControllerService: AuctionControllerService,
    private errorHandlingService: ErrorHandlingService,
    private auctionLitigationCaseControllerService: AuctionLitigationCaseControllerService,
    private conveyanceControllerService: ConveyanceControllerService
  ) {}

  public activeLedSubject: BehaviorSubject<IActiveLed> = new BehaviorSubject<IActiveLed>({});

  async getInquiryLedInfo(litigationId: string): Promise<LedInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryLedInfo(litigationId))
    );
  }

  async getInquiryPreferentialOrderInfo(litigationCaseId: number, ledId: string): Promise<PreferentialOrderInfo> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.getPreferentialOrders(litigationCaseId, ledId))
    );
  }

  async getInquirySeizureInfo(ledId: number, litigationCaseId: number): Promise<SeizureInfoResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquirySeizureInfoByLedIdAndLitigationCaseId(ledId, litigationCaseId))
    );
  }

  async getInquiryAuctionExpense(ledId: number, litigationCaseId: number): Promise<AdditionalExpenseAuctionDto> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.auctionControllerService.inquiryAuctionExpense(ledId, litigationCaseId))
    );
  }

  async getConveyanceDocumentUploads(aucRef: number): Promise<ConveyanceDocumentUploadResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getConveyanceDocumentUploads(aucRef))
    );
  }

  async getDocumentUploads(conveyanceDocUploadId: number): Promise<ConveyanceDocumentUploadResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getDocumentUploads(conveyanceDocUploadId))
    );
  }

  async postConveyanceDocumentUpload(
    aucRef: number,
    request: ConveyanceUploadDocumentRequest
  ): Promise<ConveyanceUploadDocumentResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.postConveyanceDocumentUpload(aucRef, request))
    );
  }

  async validateDocumentConveyanceUploads(aucRef: number): Promise<DocConveyanceUploadValidationResponse> {
    return await this.errorHandlingService.invokeNoRetry(
      () => lastValueFrom(this.conveyanceControllerService.validateDocumentConveyanceUploads(aucRef)),
      { notShowAsSnackBar: true }
    );
  }

  async auctionResultRecordingSubmit(
    conveyanceDocUploadId: number,
    taskId: number,
    request: AuctionResultRecordingSubmitRequest
  ): Promise<DocConveyanceUploadValidationResponse> {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.conveyanceControllerService.auctionResultRecordingSubmit(conveyanceDocUploadId, taskId, request)
      )
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

  /**
   * ดึงข้อมูล โอนกรรมสิทธ์ : กำลังดำเนินการ
   * @param conveyanceDocUploadId
   * @param taskId
   * @param request
   * @returns
   */
  async auctionLedCardOwnershipProcessList(
    litigationCaseId: number,
    ledId: number
  ): Promise<Array<AuctionLitigationConveyanceProcessDto>> {
    return lastValueFrom(
      this.auctionLitigationCaseControllerService.getAuctionLitigationCaseConveyanceProcess(ledId, litigationCaseId)
    );
  }

  /**
   * ดึงข้อมูล โอนกรรมสิทธ์ : โอนกรรมสิทธ์เสร็จสิ้น
   * @param conveyanceDocUploadId
   * @param taskId
   * @param request
   * @returns
   */
  async auctionLedCardOwnershipCompletedList(
    litigationCaseId: number,
    ledId: number
  ): Promise<Array<AuctionLitigationConveyanceProcessDto>> {
    return lastValueFrom(
      this.auctionLitigationCaseControllerService.getAuctionLitigationCaseConveyanceComplete(ledId, litigationCaseId)
    );
  }

  /**
   * ดึงข้อมูล ตัดบัญชีชำระหนี้ : กำลังดำเนินการ
   * @param conveyanceDocUploadId
   * @param taskId
   * @param request
   * @returns
   */
  async auctionDebtSettlementAccountProcessList(
    ledId: number,
    litigationCaseId: number
  ): Promise<Array<AuctionLigationCaseDebtSettlementAccountResponse>> {
    return lastValueFrom(
      this.auctionLitigationCaseControllerService.getAuctionLitigationCaseDebtSettlementAccountProcess(
        ledId,
        litigationCaseId
      )
    );
  }

  /**
   * ดึงข้อมูล ตัดบัญชีชำระหนี้ : ตัดชำระหนี้เสร็จสิ้น
   * @param conveyanceDocUploadId
   * @param taskId
   * @param request
   * @returns
   */
  async auctionDebtSettlementAccountCompletedList(
    ledId: number,
    litigationCaseId: number
  ): Promise<Array<AuctionLigationCaseDebtSettlementAccountResponse>> {
    return lastValueFrom(
      this.auctionLitigationCaseControllerService.getAuctionLitigationCaseDebtSettlementAccountComplete(
        ledId,
        litigationCaseId
      )
    );
  }

  // ############ start LEX2-18039-18046 ############
  async getAccountDocumentsByAccountDocFollowUpId(accountDocFollowUpId: number): Promise<AccountDocumentsResponse> {
    /* retreive when open the section with task */
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getAccountDocumentsByAccountDocFollowUpId(accountDocFollowUpId))
    );
  }
  async getAccountDocumentsByAucRef(aucRef: number): Promise<AccountDocumentsResponse> {
    /* retreive when open On-request (No task occurs yet) */
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getAccountDocumentsByAucRef(aucRef))
    );
  }
  // async getDeedGroupsData(aucRef: string): Promise<DeedGroupsData> {
  async getAccountDocumentDeedGroupsByAucRef(aucRef: number): Promise<AccountDocumentDeedGroupsResponse> {
    /* deed-groupss DD */
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.getAccountDocumentDeedGroupsByAucRef(aucRef))
    );
  }
  async approveAccountDocumentFollowUpTask(
    accountDocFollowUpId: number,
    taskId: number,
    request: AccountDocumentFollowUpTaskApprovalRequest
  ) {
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.conveyanceControllerService.approveAccountDocumentFollowUpTask(accountDocFollowUpId, taskId, request)
      )
    );
  }
  async validateAccountDocumentFollowupProcess(aucRef: number): Promise<AccountDocumentValidationResponse> {
    /* validate before starting on-request */
    return await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.validateAccountDocumentFollowupProcess(aucRef))
    );
  }
  async postResultRecording(request: AccountDocumentResultRecordingRequest) {
    await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(this.conveyanceControllerService.postResultRecording(request))
    );
  }
  async postResultRecordingTasksSubmit(
    accountDocFollowUpId: number,
    taskId: number,
    request: AccountDocumentResultRecordingRequest
  ) {
    await this.errorHandlingService.invokeNoRetry(() =>
      lastValueFrom(
        this.conveyanceControllerService.postResultRecordingTasksSubmit(accountDocFollowUpId, taskId, request)
      )
    );
  }
  // ############ END LEX2-18039-18046 ############
}
